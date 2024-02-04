import React, { useState } from "react";
import { Typography } from "../../components";

const H3 = ({ children }) => <h3 style={{ color: "darkBlue" }}>{children}</h3>;

const { Text, Paragraph } = Typography;

// 省略中间
const EllipsisMiddle = (props) => {
  const { suffixCount, children, ...rest } = props;

  const start = children.slice(0, children.length - suffixCount).trim();
  const suffix = children.slice(-suffixCount).trim();

  return (
    <Text style={{ maxWidth: "100%" }} ellipsis={{ suffix }} {...rest}>
      {start}
    </Text>
  );
};

// 后缀
const Suffix = () => {
  const [rows, setRows] = useState(3);

  const article =
    "To be, or not to be, that is a question: Whether it is nobler in the mind to suffer. The slings and arrows of outrageous fortune Or to take arms against a sea of troubles, And by opposing end them? To die: to sleep; No more; and by a sleep to say we end The heart-ache and the thousand natural shocks That flesh is heir to, 'tis a consummation Devoutly to be wish'd. To die, to sleep To sleep- perchance to dream: ay, there's the rub! For in that sleep of death what dreams may come When we have shuffled off this mortal coil, Must give us pause. There 's the respect That makes calamity of so long life";

  return (
    <>
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

// 页面
const EllipsisPage = () => {
  const [ellipsis, setEllipsis] = useState(true);
  return (
    <div className="dev-ellipsis-page" style={{ width: "50%" }}>
      <H3>省略中间</H3>
      <EllipsisMiddle suffixCount={18}>
        In the process of internal desktop applications development, many
        different design specs and implementations would be involved, which
        might cause designers and developers difficulties and duplication and
        reduce the efficiency of development.
      </EllipsisMiddle>

      <H3>后缀</H3>
      <Suffix />

      <H3>省略号</H3>
      <button
        onClick={() => {
          setEllipsis(!ellipsis);
        }}
      >
        Expand
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

export default EllipsisPage;
