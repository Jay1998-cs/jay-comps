import React, { useState } from "react";

import { Typography } from "../../components";
const { Paragraph } = Typography;

const textData = `
        In the process of internal desktop applications development, many
        different design specs and implementations would be involved, which
        might cause designers and developers difficulties and duplication and
        reduce the efficiency of development.
`;

const H3 = ({ children }) => <h3 style={{ color: "darkBlue" }}>{children}</h3>;

// 1.省略末尾
const EllipsisTail = ({ children }) => {
  const [ellipsis, setEllipsis] = useState(true);

  return (
    <div>
      <button
        onClick={() => {
          setEllipsis((pre) => !pre);
        }}
      >
        Expand or Ellipsis
      </button>
      <Paragraph ellipsis={ellipsis}>{children}</Paragraph>
    </div>
  );
};

// 2.省略中间,后缀显示部分文字 ellipsis: { suffix: "suffixText"}
const EllipsisMiddle = (props) => {
  const { suffixCount, children, ...rest } = props;

  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim(); // suffix text

  // 【注意】传给ellipsis的是一个对象: { suffix: "...suffix text"}
  const [suffixConfig, setSuffixConfig] = useState({ suffix });

  return (
    <div>
      <button
        onClick={() => {
          setSuffixConfig((pre) => (pre ? false : { suffix }));
        }}
      >
        Expand or Ellipsis
      </button>
      <Paragraph style={{ maxWidth: "100%" }} ellipsis={suffixConfig} {...rest}>
        {start}
      </Paragraph>
    </div>
  );
};

// 3.显示n行&后缀&展开 ellipsis:{ rows:n, expandable:true, suffix: "--William Shakespeare" }
const EllipsisSuffix = () => {
  const [rows, setRows] = useState(3);

  const article =
    "To be, or not to be, that is a question: Whether it is nobler in the mind to suffer. The slings and arrows of outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis a consummation Devoutly to be wish'd. To die, to sleep To sleep- perchance to dream: ay, there's the rub! For in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause. There 's the respect That makes calamity of so long life";

  return (
    <>
      <div>
        <button
          onClick={() => {
            setRows((pre) => (pre + 1) % 10);
          }}
        >
          显示行数+1
        </button>
        <span> </span>
        <button
          onClick={() => {
            setRows((pre) => (pre - 1 >= 0 ? pre - 1 : 0));
          }}
        >
          显示行数-1
        </button>
      </div>
      <Paragraph
        ellipsis={{
          rows,
          expandable: true,
          suffix: "--William Shakespeare",
          onEllipsis: (ellipsis) => {
            console.log("Ellipsis changed:", ellipsis);
          },
        }}
        title={`${article}--William Shakespeare`}
      >
        {article}
      </Paragraph>
    </>
  );
};

// 4.默认展开文字是Expand, 可改为ellipsis:{ rows: 3, expandable: true, symbol: "more" }
const EllipsisSymbol = () => {
  const [ellipsis, setEllipsis] = useState(true);

  return (
    <div>
      <button
        onClick={() => {
          setEllipsis(!ellipsis);
        }}
      >
        Expand or Ellipsis
      </button>
      <Paragraph ellipsis={ellipsis}>
        Ant Design, a design language for background applications, is refined by
        Ant UED Team. Ant Design, a design language for background applications,
        is refined by Ant UED Team. Ant Design, a design language for background
        applications, is refined by Ant UED Team. Ant Design, a design language
        for background applications, is refined by Ant UED Team. Ant Design, a
        design language for background applications, is refined by Ant UED Team.
        Ant Design, a design language for background applications, is refined by
        Ant UED Team.
      </Paragraph>

      <Paragraph
        type="secondary"
        ellipsis={
          ellipsis ? { rows: 3, expandable: true, symbol: "more" } : false
        }
      >
        Ant Design, a design language for background applications, is refined by
        Ant UED Team. Ant Design, a design language for background applications,
        is refined by Ant UED Team. Ant Design, a design language for background
        applications, is refined by Ant UED Team. Ant Design, a design language
        for background applications, is refined by Ant UED Team. Ant Design, a
        design language for background applications, is refined by Ant UED Team.
        Ant Design, a design language for background applications, is refined by
        Ant UED Team.
      </Paragraph>
    </div>
  );
};

//////////////////////////////////////////////////////////////////
// 页面
const EllipsisPage = () => {
  return (
    <div className="dev-ellipsis-page" style={{ width: "50%" }}>
      <H3>6.1 省略末尾 ellipsis: boolean</H3>
      <EllipsisTail>{textData}</EllipsisTail>

      <H3>6.2 省略中间: {`ellipsis:{ suffix:{suffixText} }`} </H3>
      <EllipsisMiddle suffixCount={25}>{textData}</EllipsisMiddle>

      <H3>
        6.3 显示n行&后缀&展开:
        {` ellipsis:{ rows:n, expandable:true, suffix: "--William Shakespeare" }`}
      </H3>
      <EllipsisSuffix />

      <H3>6.4 ellipsis 综合示例</H3>
      <EllipsisSymbol />
    </div>
  );
};

export default EllipsisPage;
