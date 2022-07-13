import React, { useEffect, useRef, useState } from 'react';
import bg from '../../assets/background.png';
import bird from '../../assets/bird.png';
import fg from '../../assets/fg.png';
import pipe from '../../assets/pipe.png';
import topPipe from '../../assets/top-pipe.png';
import './Game.scss';
import Bird from './Classes/Bird';
import handleParticles from './Classes/Particles';
import handlePipes from './Classes/Pipes';
import { handleCollision } from './Classes/Pipes';
import { useDispatch } from 'react-redux/es/exports';
import { updateUser } from '../../store/slices/UserSlice';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 500;

const BIRD_HEIGHT = 40;
const BIRD_WIDTH = 60;

const FG_HEIGHT = 100;

const Game = () => {
  const canvasRef = useRef(null);
  const birdRef = useRef(null);
  const topPipeRef = useRef(null);
  const bottomPipeRef = useRef(null);
  const bgRef = useRef(null);
  const fgRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const dispatch = useDispatch();
  const jwt = localStorage.getItem('jwt');
  const score = sessionStorage.getItem('score');

  useEffect(() => {
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    // ЗАДНИЙ ФОН
    const bgI = bgRef.current;
    // ПТИЦА
    const birdI = birdRef.current;
    // ТРУБА ВЕРХНЯЯ
    const pipeTopI = topPipeRef.current;
    // ТРУБА НИЖНЯЯ
    const bottomPipeI = bottomPipeRef.current;
    // ЗЕМЛЯ
    const fgI = fgRef.current;

    let angle = 0;
    let frame = -100;
    window.GAME_SCORE = 0;

    const bird = new Bird(
      ctx,
      birdI,
      CANVAS_HEIGHT,
      CANVAS_WIDTH,
      BIRD_HEIGHT,
      BIRD_WIDTH
    );

    function toggleSpaceClick(e) {
      if (e.code === 'Space') {
        window.GAMEisClicked = window.GAMEisClicked ? false : true;
      }
    }

    function toggleMouseClick(e) {
      window.GAMEisClicked = window.GAMEisClicked ? false : true;
    }

    document.addEventListener('keydown', toggleSpaceClick);
    document.addEventListener('keyup', toggleSpaceClick);
    document.addEventListener('mousedown', toggleMouseClick);
    document.addEventListener('mouseup', toggleMouseClick);
    (function render() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(bgI, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(fgI, 0, CANVAS_HEIGHT - FG_HEIGHT, CANVAS_WIDTH, FG_HEIGHT);
      bird.update(false, angle);
      bird.draw();
      handleParticles(bird, 2, ctx, 'red');
      handlePipes(
        frame,
        ctx,
        CANVAS_HEIGHT,
        CANVAS_WIDTH,
        bottomPipeI,
        pipeTopI,
        2,
        bird.x
      );
      ctx.fillStyle = 'black';
      ctx.font = '40px Montserrat';
      ctx.fillText('Score : ' + window.GAME_SCORE, 10, CANVAS_HEIGHT - 20);
      handleCollision(bird, CANVAS_HEIGHT);
      if (handleCollision(bird, CANVAS_HEIGHT)) {
        setIsPaused(true);
        if (window.GAME_SCORE > score)
          dispatch(updateUser({ jwt, score: window.GAME_SCORE }));
        return;
      }
      if (!isPaused) requestAnimationFrame(render);
      angle += 0.12;
      frame++;
    })();
    return () => {
      document.removeEventListener('keydown', toggleSpaceClick);
      document.removeEventListener('keyup', toggleSpaceClick);
      document.removeEventListener('mousedown', toggleMouseClick);
      document.removeEventListener('mouseup', toggleMouseClick);
    };
  }, []);

  return (
    <div className='game'>
      <canvas
        ref={canvasRef}
        id='canvas'
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      ></canvas>
      <img ref={birdRef} className='game__img' src={bird} alt='птица' />
      <img ref={topPipeRef} src={topPipe} className='game__img' alt='птица' />
      <img ref={bottomPipeRef} src={pipe} alt='птица' className='game__img' />
      <img ref={bgRef} src={bg} alt='птица' className='game__img' />
      <img src={fg} ref={fgRef} alt='птица' className='game__img' />
    </div>
  );
};

export default Game;
