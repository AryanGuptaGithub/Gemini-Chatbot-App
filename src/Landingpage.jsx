import React from 'react'
import styled from 'styled-components';
import './index.css'

const AnimatedImg = styled.img`
  width: 180px;
  height: 180px;
  margin-bottom: 1rem;
  animation: float 2s ease-in-out infinite;

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-15px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

const Button = styled.button`
  background-color: #000000;
  color: #ffd900;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0b980f;
    color: white;
  }
`;

const AnimatedHeading = styled.h1`
  font-weight: 800;
  font-size: 3rem;
  color: #e11735;
  animation: fadeUp 1.3s ease;
  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const TextContainer = styled.div`
  text-align: center;
  margin: 20px;
  color: #7f7f7f;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`

const Landingpage = ({setShowChatbot}) => {
  const onButtonClick = () => {
    setShowChatbot(prev => !prev);
  }

  return (
    <Container>
      <AnimatedImg src="https://png.pngtree.com/png-vector/20230225/ourmid/pngtree-smart-chatbot-cartoon-clipart-png-image_6620453.png" alt="chatbot logo" />
      <TextContainer>
        <AnimatedHeading className='text-3xl'>Welcome to the Ai Chatbot</AnimatedHeading>
        <p>This chatbot is powered by Google Gemini</p>
      </TextContainer>
      <Button onClick={onButtonClick} >Start chatting..</Button>
    </Container>
  )
}

export default Landingpage