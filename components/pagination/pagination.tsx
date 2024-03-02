import React, {
  MouseEventHandler,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classNames from "classnames";

import { ConfigContext } from "../config-provider";
import useStyle from "./style";

export interface PaginationProps {
  prefixCls: string;
  className: string;
  defaultActiveNumber: number; // 初始默认选中的页码
  totalPages: number; // 总页数
  countOfPerPage: number; // 展示的页码数量
  prevBtn: React.ReactNode;
  nextBtn: React.ReactNode;
  style: React.CSSProperties;

  onPageNumberClick: (activeNumber: number) => {}; // 单击页码触发的回调函数
}

// 标识符(用于类名、自定义属性等)
const BTN_CLASS = "btn"; // 按钮通用类名
const NUMBER_BTN = "number"; // 数值号码按钮
const TEXT_BTN = "text"; // 上、下一页按钮
const PREV_BTN = "prev"; // 上一页按钮标识符
const NEXT_BTN = "next"; // 下一页按钮标识符
const BTN_ACTIVED = "actived"; // 数值按钮激活类名
const BTN_HIDDEN = "hidden"; // 上、下按钮隐藏样式的类名

// 生成[start, end]数组
export function getArray(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

// ================================== 页码
const pagination = forwardRef<any, PaginationProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    defaultActiveNumber = 1,
    prevBtn = "prev",
    nextBtn = "next",
    totalPages = 0,
    countOfPerPage = 5,
    style: customizeStyle = {},
    onPageNumberClick,
  } = props;
  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls("pagination", customizePrefixCls);
  const [WrapCSSVar, hashId, cssVarCls] = useStyle(prefixCls);

  const prevBtnRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLDivElement>(null);
  const [activedNumber, setActivedNumber] =
    useState<number>(defaultActiveNumber);
  const [numberList, setNumberList] = useState(getArray(1, countOfPerPage));

  // 赋予外部更新页码的权力
  useImperativeHandle(ref, () => {
    return {
      setPageNumberActive: (pageNumber: number) => {
        if (pageNumber !== activedNumber) {
          setActivedNumber(pageNumber);
        }
      },
    };
  });

  // >>>>> className
  const paginationClasses = classNames(prefixCls, className, hashId, cssVarCls);

  // >>>>> update
  const MAX_NUM = totalPages; // 页码的最大取值，如10
  const center = Math.floor(countOfPerPage / 2) + 1; // 页码栏中心点索引，如6
  const INIT_OFFSET_NUMBER = center + 1; // 第一个发生偏移的位置，如6
  const LAST_NUMBER_BEGIN =
    countOfPerPage * (totalPages / countOfPerPage - 1) + 1; // 最后页码的起始数，如6~10的6
  const LEFT_COUNT = center - 1; // 中心位置左侧的页码数量，如2
  const RIGHT_COUNT = countOfPerPage - center; // 偏移位置右侧的页码数量，如2

  // 根据当前激活的页码号，更新待渲染的页码列表
  const updateNumberList = (num: number) => {
    if (num >= INIT_OFFSET_NUMBER && num < LAST_NUMBER_BEGIN) {
      // 偏移
      const LEFT_NUMBER = Math.max(num - LEFT_COUNT, 1); // 左边界
      const RIGHT_NUMBER = Math.min(MAX_NUM, num + RIGHT_COUNT); // 有边界
      setNumberList(getArray(LEFT_NUMBER, RIGHT_NUMBER));
    } else if (num >= LAST_NUMBER_BEGIN) {
      // 最后的countOfPerPage个页码
      const LEFT_NUMBER = Math.max(totalPages - countOfPerPage + 1, 1); // 下界
      const RIGHT_NUMBER = Math.min(totalPages, MAX_NUM); // 上界
      setNumberList(getArray(LEFT_NUMBER, RIGHT_NUMBER));
    } else {
      // 最开始的countOfPerPage个页码
      setNumberList(getArray(1, countOfPerPage));
    }
  };

  // 监听页码变动，处理按钮的样式，动态添加类名
  useEffect(() => {
    // “上一页”按钮样式，页码为第一页时隐藏prev按钮
    if (prevBtnRef && prevBtnRef.current) {
      const prevBtn = prevBtnRef.current;
      if (activedNumber > 1) {
        prevBtn.classList.remove(BTN_HIDDEN);
      } else {
        prevBtn.classList.add(BTN_HIDDEN);
      }
    }
    // “下一页”按钮样式，页码为最后一页时隐藏next按钮
    if (nextBtnRef && nextBtnRef.current) {
      const nextBtn = nextBtnRef.current;
      if (activedNumber % MAX_NUM === 0) {
        nextBtn.classList.add(BTN_HIDDEN);
      } else {
        nextBtn.classList.remove(BTN_HIDDEN);
      }
    }
    // 更新页码列表
    updateNumberList(activedNumber);
    // 激活父类回调函数
    if (typeof onPageNumberClick === "function") {
      onPageNumberClick(activedNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activedNumber, MAX_NUM]);

  // >>>>> event
  // 单击数字按钮事件处理
  const processNumberBtnClicked = (target: HTMLElement) => {
    if (target == null) {
      return;
    }
    // 获取该按钮对应的页码值
    const numberActivedStr = target.dataset.number || "";
    const numberActived = parseInt(numberActivedStr);
    if (numberActived === activedNumber) {
      return; // 页码没变化，直接返回
    }
    setActivedNumber(numberActived); // 更新激活的页码
  };

  // 单击上一页/下一页按钮事件处理
  const processTextBtnClicked = (target: HTMLElement) => {
    if (target == null) {
      return;
    }
    // 根据data-id，判断是上还是下一页按钮(prev or next)
    const id = target.dataset.id;
    if (id === PREV_BTN) {
      setActivedNumber((preNumber) => preNumber - 1);
    } else if (id === NEXT_BTN) {
      setActivedNumber((preNumber) => preNumber + 1);
    }
  };

  // 单击页码按钮事件处理
  const handleBtnClick: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 获取目标对象
    const target = e.target as HTMLElement;
    if (!target) {
      console.warn("click button: cannot find event target object.");
      return;
    }
    if (!target.classList.contains(BTN_CLASS)) {
      return; // 不是为可单击的目标项
    }

    // 判断是哪一类(数字/上下)按钮
    if (target.classList.contains(NUMBER_BTN)) {
      processNumberBtnClicked(target); // 处理数值号码单击事件
    } else if (target.classList.contains(TEXT_BTN)) {
      processTextBtnClicked(target); // 处理上/下一页按钮单击事件
    }
  };

  // >>>>> render
  // 数值按钮
  const numberNodes = numberList.map((num) => {
    if (num === activedNumber) {
      return (
        <span
          className={`${BTN_CLASS} ${NUMBER_BTN} ${BTN_ACTIVED}`}
          key={num}
          data-number={num}
        >
          {num}
        </span>
      );
    }
    return (
      <span
        className={`${BTN_CLASS} ${NUMBER_BTN}`}
        key={num}
        data-number={num}
      >
        {num}
      </span>
    );
  });

  // 页码栏
  const paginationBar = (
    <div
      className={paginationClasses}
      ref={ref}
      style={customizeStyle}
      onClick={handleBtnClick}
    >
      <div
        data-id={`${PREV_BTN}`}
        ref={prevBtnRef}
        className={`${BTN_CLASS} ${PREV_BTN} ${TEXT_BTN} ${BTN_HIDDEN}`}
      >
        {prevBtn}
      </div>
      {numberNodes}
      <div
        data-id={`${NEXT_BTN}`}
        ref={nextBtnRef}
        className={`${BTN_CLASS} ${PREV_BTN} ${TEXT_BTN}`}
      >
        {nextBtn}
      </div>
    </div>
  );

  if (totalPages == null || totalPages === 0) {
    return null;
  }

  if (typeof WrapCSSVar === "function") {
    return WrapCSSVar(paginationBar);
  }
  return paginationBar;
});

export default pagination;
