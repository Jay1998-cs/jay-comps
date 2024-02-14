import { TokenType, genComponentStyleHook } from "../../theme";

export type QRCodeToken = TokenType & {
  componentCls: string;
};

const useStyle = (token: QRCodeToken) => {
  return genComponentStyleHook("qrcode", (token: QRCodeToken) => [{}]);
};
