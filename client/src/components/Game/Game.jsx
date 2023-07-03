import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux/es/exports';
import bg from '../../assets/background.png';
import bird from '../../assets/bird-standart.png';
import bird_skin_1 from '../../assets/bird-skin-1.png';
import bird_skin_2 from '../../assets/bird-skin-2.png';
import fg from '../../assets/fg.png';
import pipe from '../../assets/pipe.png';
import topPipe from '../../assets/top-pipe.png';
import {loginUser, updateUser} from '../../store/slices/UserSlice';
import Bird from './Classes/Bird';
import handleParticles from './Classes/Particles';
import handlePipes, {handleCollision} from './Classes/Pipes';
import './Game.scss';
import deathSound from '../../sounds/die.mp3';
import scoreSound from '../../sounds/point.mp3';
import {useSelector} from "react-redux";
import {$api} from "../../api/api";
import {getMySkins} from "../../store/slices/ShopSlice";
import {getMySkinsSelector} from "../Shop/selectors/selectors";

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 400;

const BIRD_HEIGHT = 30;
const BIRD_WIDTH = 40;

const Game = () => {
	const canvasRef = useRef(null);
	const birdRef = useRef(null);
	const topPipeRef = useRef(null);
	const bottomPipeRef = useRef(null);
	const bgRef = useRef(null);
	const deathSoundRef = useRef(null);
	const scoreSoundRef = useRef(null);
	const fgRef = useRef(null);
	const [isPaused, setIsPaused] = useState(false);
	const [isStarted, setIsStarted] = useState(false);
	const user = useSelector(state => state.user);
	const serverUrl = $api.defaults.baseURL
	const [skin, setSkin] = useState(
		user.settings.selectedSkinId || 1
	);

	const skinPath = useSelector(getMySkinsSelector)?.find((item) => item.id === skin)?.imageURL
	const dispatch = useDispatch();
	const jwt = localStorage.getItem('jwt');
	const score = user.score


	const toggleGame = (e) => {
		setIsStarted(!isStarted);
		setIsPaused(false);
	};

	useEffect(() => {
		dispatch(getMySkins())
		dispatch(loginUser({jwt: localStorage.getItem("jwt")}))
	}, []);

	useEffect(() => {
		dispatch(loginUser({jwt: localStorage.getItem("jwt")}))
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
		let angle = 0;
		let frame = 50;
		window.GAME_SCORE = 0;
		let pipesArray = [];
		// ЗВУК СМЕРТИ
		let deathSoundMP;
		// ЗВУК ПОИНТА
		let scoreSoundMP;
		if (user.settings.sounds) {
			deathSoundMP = deathSoundRef.current;
			scoreSoundMP = scoreSoundRef.current;
		}

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
		document.addEventListener('touchstart', toggleMouseClick);
		document.addEventListener('touchend', toggleMouseClick);
		(function render() {
			ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			ctx.drawImage(bgI, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
			bird.update(false, angle);
			bird.draw();
			handlePipes(
				frame,
				ctx,
				CANVAS_HEIGHT,
				CANVAS_WIDTH,
				bottomPipeI,
				pipeTopI,
				2,
				bird.x,
				pipesArray,
				scoreSoundMP
			);
			handleCollision(bird, CANVAS_HEIGHT, pipesArray);
			if (handleCollision(bird, CANVAS_HEIGHT, pipesArray)) {
				if (deathSoundMP) deathSoundMP.play();
				ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
				setIsPaused(true);
				dispatch(updateUser({jwt, score: window.GAME_SCORE}));
				return;
			}
			if (!isPaused) requestAnimationFrame(render);
			ctx.fillStyle = 'black';
			ctx.font = '40px Montserrat';
			ctx.fillText('Score : ' + window.GAME_SCORE, 10, CANVAS_HEIGHT - 20);
			angle += 0.12;
			frame++;
		})();
		return () => {
			document.removeEventListener('keydown', toggleSpaceClick);
			document.removeEventListener('keyup', toggleSpaceClick);
			document.removeEventListener('mousedown', toggleMouseClick);
			document.removeEventListener('mouseup', toggleMouseClick);
			document.removeEventListener('touchstart', toggleMouseClick);
			document.removeEventListener('touchend', toggleMouseClick);
		};
	}, [isStarted]);

	return (
		<div className={'game_wrapper'}>
			<div className='game'>
				<canvas
					ref={canvasRef}
					id='canvas'
					width={CANVAS_WIDTH}
					height={CANVAS_HEIGHT}
				></canvas>
				<div className={`after_game_menu ${!isPaused && 'after_game_menu_inbisible'}`}>
					<span className={'score'}>Счет {window.GAME_SCORE}</span>
					<span className={'best'}>Лучший счет {score}</span>
					<span className={'earn'}>Заработано {window.GAME_SCORE}$</span>
					<button
						className={`button button_default game__button ${
							!isPaused && 'game__button_invisible'
						}`}
						onClick={toggleGame}
					>
						Начать заново
					</button>
				</div>
				<div className={`game__skins game__skins_inactive`}>
					<img
						ref={birdRef}
						className={`standart game__skin`}
						src={`${serverUrl}${skinPath}`}
						alt='скин стандартный'
					/>
				</div>
				<img ref={topPipeRef} src={topPipe} className='game__img' alt='птица'/>
				<img ref={bottomPipeRef} src={pipe} alt='птица' className='game__img'/>
				<img ref={bgRef} src={bg} alt='птица' className='game__img'/>
				<img src={fg} ref={fgRef} alt='птица' className='game__img'/>
				<audio ref={deathSoundRef} src={deathSound}/>
				<audio ref={scoreSoundRef} src={scoreSound}/>
			</div>
		</div>
	);
};

export default Game;
