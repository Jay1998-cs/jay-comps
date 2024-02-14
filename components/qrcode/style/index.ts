import { TokenType, genComponentStyleHook } from "../../theme";
import { genQRCodeStyle } from "./genStyleByToken";

export type QRCodeToken = TokenType & {
  componentCls: string;

  QRCodeExpiredTextColor: string;
  QRCodeScannedTextColor: string;
  QRCodeMaskBackgroundColor: string;
};

const useStyle = genComponentStyleHook("QRCode", (token: QRCodeToken) => {
  const mergedToken = Object.assign(
    {},
    {
      QRCodeExpiredTextColor: "rgba(0, 0, 0, 0.88)",
      QRCodeScannedTextColor: "rgba(0, 0, 0, 0.88)",
      QRCodeMaskBackgroundColor: "rgba(255, 255, 255, 0.96)",
    },
    token
  );

  return [genQRCodeStyle(mergedToken)];
});

export default useStyle;
