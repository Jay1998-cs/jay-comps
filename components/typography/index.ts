import Text from "./Text";
import Link from "./Link";
import Title from "./Title";
import Paragraph from "./Paragraph";
import InnerTypography from "./Typography";

export type TypographyProps = typeof InnerTypography & {
  Text: typeof Text;
  Link: typeof Link;
  Title: typeof Title;
  Paragraph: typeof Paragraph;
};

const Typography = InnerTypography as TypographyProps;

Typography.Text = Text;
Typography.Link = Link;
Typography.Title = Title;
Typography.Paragraph = Paragraph;

export default Typography;
