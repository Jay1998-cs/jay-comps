import { TokenType, genComponentStyleHook } from "../../theme";

export type QRCodeToken = TokenType & {
  componentCls: string;
};

const useStyle = genComponentStyleHook("qrcode", (token: QRCodeToken) => [{}]);

export default useStyle;
