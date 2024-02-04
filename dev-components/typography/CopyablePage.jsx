import React from "react";
import { Typography } from "../../components";

const CopyablePage = () => {
  const { Paragraph, Link } = Typography;
  return (
    <div className="dev-copyabled-page">
      <Paragraph copyable key="1das">
        This is a copyable text.
      </Paragraph>
      <Paragraph copyable={{ text: "Hello, world!" }}>
        replace copyable text (Hello, world!).
      </Paragraph>
      <Link
        href="https://www.hao123.com"
        target="_blank"
        copyable={{ text: "https://www.hao123.com" }}
      >
        copy link
      </Link>
    </div>
  );
};

export default CopyablePage;
