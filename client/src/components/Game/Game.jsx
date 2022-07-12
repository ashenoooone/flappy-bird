import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import background from '../../assets/background.png';
import bird from '../../assets/bird.png';

const BIRD_SIZE = 40;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 600;
const GRAVITY = 6;

const Game = () => {
  const [birdPosition, setBirdPosition] = useState(400);
  useEffect(() => {
    let timerId;
    if (birdPosition < GAME_HEIGHT - BIRD_SIZE * 2) {
      timerId = setInterval(() => {
        setBirdPosition((birdPosition) => birdPosition + GRAVITY);
      }, 24);
    }
    return () => {
      clearInterval(timerId);
    };
  });

  const handleClick = () => {
    let newBirdPosition = birdPosition - 90;
    if (newBirdPosition < 0) {
      setBirdPosition(0);
    } else {
      setBirdPosition(newBirdPosition);
    }
  };

  return (
    <Container>
      <GameBox onClick={handleClick} width={GAME_WIDTH} height={GAME_HEIGHT}>
        <Bird size={BIRD_SIZE} position={birdPosition} />
      </GameBox>
    </Container>
  );
};

export default Game;

const Container = styled.section`
  display: flex;
  padding: 40px;
  justify-content: center;
`;

const GameBox = styled.div`
  max-width: ${(props) => props.width + 'px'};
  height: ${(props) => props.height + 'px'};
  width: 100%;
  background-image: url(${background});
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  justify-content: center;
`;

const Bird = styled.div`
  position: absolute;
  background-image: url(${bird});
  height: ${(props) => props.size + 'px'};
  width: ${(props) => props.size + 20 + 'px'};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  top: ${(props) => {
    return props.position + 'px';
  }};
  transition: all 0.1s linear;
`;
