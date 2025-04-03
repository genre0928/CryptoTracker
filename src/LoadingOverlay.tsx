// components/LoadingOverlay.tsx
import React from "react";
import styled, { keyframes } from "styled-components";

// 스피너 회전 애니메이션
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4); // 불투명한 검정 배경
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Spinner = styled.div`
  width: 64px;
  height: 64px;
  border: 4px solid rgba(255, 255, 255, 0.4);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.p`
  margin-top: 16px;
  color: white;
  font-size: 1.125rem;
  font-weight: 600;
`;

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  message = "Loading...",
}) => {
  return (
    <Overlay>
      <Spinner />
      <Message>{message}</Message>
    </Overlay>
  );
};

export default LoadingOverlay;
