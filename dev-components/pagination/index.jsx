import React, { useRef } from "react";

import { ConfigProvider, Pagination } from "../../components";

const explainPagination = () => {
  return (
    <ul>
      <li>设显示的页码个数为 d (如百度底栏一次展示10个页码)</li>
      <li>中心位置 c = Math.floor(d/2) + 1</li>
      <li>
        偏移位置 f= c + 1，当单击的页码{` x >= c `}
        时，页码栏触发更新，尽可能使 x 位于中心
      </li>
      <li>
        触发更新时，渲染 [x-leftCount, x + rightCount] 的号码，而leftCount = c -
        1，rightCount = d - c
      </li>
      <li>剩余两种情况就是“起始”和“终止”情形，注意边界即可</li>
    </ul>
  );
};

const Vflex = ({ children, style }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "720px",
      }}
    >
      {children}
    </div>
  );
};

const PaginationPage = () => {
  const pRef = useRef(null);

  const handleChange = (e) => {
    pRef?.current?.setPageNumberActive(parseInt(e.target.value));
  };

  return (
    <div className="dev-pagination-page">
      <h1>Pagination</h1>
      {explainPagination()}
      <Vflex>
        <div>
          <div>总页数1页：</div>
          <Pagination totalPages={1} />
        </div>
        <div>
          <div>总页数5页，显示5个页码：</div>
          <Pagination totalPages={5} countOfPerPage={5} />
        </div>
        <div>
          <div>总页数10页，显示5个页码：</div>
          <Pagination totalPages={10} countOfPerPage={5} />
        </div>
        <div>
          <div>总页数16页，显示10个页码：</div>
          <Pagination totalPages={16} countOfPerPage={10} />
        </div>
        <div>
          <div>使用ConfigProvider实现动态主题样式，</div>
          <div>
            <span>
              且使用useImperativeHandle赋予外部设置页码的权力(setPageNumberActive):{" "}
            </span>
            <input
              type="number"
              max={30}
              onChange={handleChange}
              defaultValue={12}
              style={{ width: "40px", textAlign: "center" }}
            ></input>
          </div>
          <ConfigProvider
            theme={{
              token: {
                colorButton: "rgba(0,0,0,0.8)",
                bgColorButton: "rgba(0,0,0,0.08)",
                bgColorButtonActived: "rgba(180,50,100,0.7)",
              },
            }}
          >
            <Pagination
              totalPages={30}
              countOfPerPage={10}
              ref={pRef}
              defaultActiveNumber={12}
            />
          </ConfigProvider>
        </div>
      </Vflex>
    </div>
  );
};

export default PaginationPage;
