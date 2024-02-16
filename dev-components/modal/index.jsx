import React from "react";

import { Button, Modal } from "../../components";

const modalContent = (
  <ul>
    <li>open属性控制modal的开关</li>
    <li>title属性设置标题</li>
    <li>footer属性设置底部</li>
    <li>Modal包裹的是其主体</li>
    <li>style属性设置CSS样式, 更多请参考antd-Modal使用</li>
    <li>详见: https://ant-design.antgroup.com/components/modal-cn</li>
  </ul>
);

const BasicModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const clickCancel = () => {
    console.log("click Cancel");
    setIsModalOpen(false);
  };
  const clickOK = () => {
    console.log("click OK");
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div>
      <h2>基础Modal</h2>
      <button onClick={openModal}>open basic modal</button>
      <Modal
        open={isModalOpen}
        title="Title"
        onOk={clickOK}
        onCancel={clickCancel}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

const AutoCloseModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const time = 3;
  const [count, setCount] = React.useState(time);

  // 倒计时
  React.useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    let counterId = setInterval(() => {
      setCount((count) => count - 1);
    }, 1000);

    let closerId = setTimeout(() => {
      clearInterval(counterId); // 清除timer1
      clearTimeout(closerId); // 清除timer2
      closerId = null;
      counterId = null;
      setIsModalOpen(false); // 关闭Modal
      setCount(time); // 复原技术
    }, time * 1000);
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const content = (
    <div>
      你好, 这是来自XX的消息...将在 <b>{count}</b> 秒后自动关闭...
    </div>
  );

  return (
    <div>
      <h2>倒计时自动关闭Modal</h2>
      <button onClick={openModal}>open auto close modal</button>
      <Modal
        open={isModalOpen}
        footer={null}
        closable={false}
        style={{ top: 30 }}
      >
        {content}
      </Modal>
    </div>
  );
};

const CustomizeModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const clickCancel = () => {
    console.log("click Cancel");
    setIsModalOpen(false);
  };
  const clickOK = () => {
    console.log("click OK");
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const afterClose = () => {
    console.log("afterClose");
  };

  const afterOpenChange = (open) => {
    console.log("afterOpenChange: ", open);
  };

  const footer = (
    <>
      <Button onClick={clickCancel}>Cancel</Button>
      <Button onClick={() => alert("search...")}>Search</Button>
      <Button
        type="primary"
        danger
        onClick={clickOK}
        style={{ backgroundColor: "#3cbf11" }}
      >
        OK
      </Button>
    </>
  );

  return (
    <div>
      <h2>自定义Modal示例</h2>
      <button onClick={openModal}>open customize modal</button>
      <Modal
        open={isModalOpen}
        title={"Modal Title"}
        footer={footer}
        onCancel={clickCancel}
        onOk={clickOK}
        afterClose={afterClose}
        afterOpenChange={afterOpenChange}
        closeIcon="关闭"
        closable={true}
        maskClosable={true}
        maskStyle={{ background: "rgba(0,0,0,0.95)" }}
        style={{
          border: "3px solid #3cbf11",
          borderRadius: "12px",
        }}
        centered
        okText="确认"
        okButtonProps={{ danger: true }}
        cancelText="取消"
        cancelButtonProps={{ style: { color: "#000" } }}
      >
        <div>{modalContent}</div>
      </Modal>
    </div>
  );
};

const ModalPage = () => {
  return (
    <div className="dev-modal-page">
      <h1>Modal</h1>
      {modalContent}
      <BasicModal />
      <AutoCloseModal />
      <CustomizeModal />
    </div>
  );
};

export default ModalPage;
