import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Result 
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn đang tìm không tồn tại."
        extra={
          <Button type="primary" onClick={goHome}>
            Quay về trang chủ
          </Button>
        }
        className="bg-white p-6  w-[1000px]ounded-2xl shadow-md"
      />
    </div>
  );
};

export default NotFound;
