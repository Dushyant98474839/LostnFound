// src/utils/useMessage.js
import { message } from "antd";
import { useMemo } from "react";

export const useCustomMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const notify = useMemo(() => ({
    success: (content = "Success!") =>
      messageApi.open({ type: "success", content }),

    error: (content = "Something went wrong!") =>
      messageApi.open({ type: "error", content }),

    warning: (content = "Warning!") =>
      messageApi.open({ type: "warning", content }),
  }), [messageApi]);

  return { notify, contextHolder };
};
