import React from 'react';
import styled from 'styled-components';

interface HeaderProps {
  boardName: string;
}

const HeaderContainer = styled.header`
  background-color: var(--gmo-blue-dark);
  color: white;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  height: 48px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.2);
`;

const BoardTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: "📋";
    font-size: 20px;
  }
`;

const Header: React.FC<HeaderProps> = ({ boardName }) => {
  return (
    <HeaderContainer>
      <BoardTitle>{boardName}</BoardTitle>
    </HeaderContainer>
  );
};

export default Header;