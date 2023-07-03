import './AddSkinPopup.scss'
import {useCallback, useEffect, useState} from "react";

export const AddSkinPopup = ({onClose, onAddSkin}) => {
	const [newSkin, setNewSkin] = useState({
		image: null,
		name: '',
		price: 0,
	});

	const handleAddSkin = () => {
		// Логика для добавления нового скина
		onAddSkin(newSkin);

		// Сброс состояния нового скина и закрытие попапа
		setNewSkin({
			image: null,
			name: '',
		});
		onClose();
	};

	const onEsc = (e) => {
		if (e.key === 'Escape') {
			onClose()
		}
	}

	useEffect(() => {
		window.addEventListener('keydown', onEsc)
		return () => {
			window.removeEventListener("keydown", onEsc)
		}
	}, []);


	const onOverlayClick = useCallback((event) => {
		onClose()
	}, [onClose]);

	const onContentClick = useCallback((event) => {
		event.stopPropagation()
	}, []);


	return (
		<div className="popup-overlay" onClick={onOverlayClick}>
			<div className="popup-content" onClick={onContentClick}>
				<h2>Добавление нового скина</h2>
				<input
					type="file"
					accept=".png, .jpg, .jpeg"
					onChange={(e) =>
						setNewSkin({...newSkin, image: e.target.files[0]})
					}
				/>
				<input
					type="text"
					placeholder="Название скина"
					value={newSkin.name}
					onChange={(e) => setNewSkin({...newSkin, name: e.target.value})}
				/>
				<input
					type="number"
					placeholder="Стоимость"
					value={newSkin.price}
					onChange={(e) => setNewSkin({...newSkin, price: e.target.value})}
				/>
				<button onClick={handleAddSkin}>Добавить</button>
				<button onClick={onClose}>Отмена</button>
			</div>
		</div>
	);
};