import React, {useCallback, useEffect, useState} from 'react';
import './UserModal.scss';

const UserModal = ({user, onClose, onAddBalance, onSubtractBalance, onBanUser, onUnbanUser}) => {
	const [balanceToAdd, setBalanceToAdd] = useState(0);
	const [balanceToSubtract, setBalanceToSubtract] = useState(0);

	const handleAddBalance = () => {
		onAddBalance(user.id, balanceToAdd);
		setBalanceToAdd(0);
		onClose()
	};

	const handleSubtractBalance = () => {
		onSubtractBalance(user.id, balanceToSubtract);
		setBalanceToSubtract(0);
		onClose()
	};

	const handleBanUser = () => {
		onBanUser(user.id);
		onClose()
	};

	const handleUnbanUser = () => {
		onUnbanUser(user.id);
		onClose()
	}

	const onEsc = (event) => {
		if (event.key === 'Escape') {
			onClose()
		}
	}


	useEffect(() => {
		window.addEventListener("keydown", onEsc)
		return () => {
			window.removeEventListener("keydown", onEsc)
		}
	}, []);


	const onContainerClick = useCallback((event) => {
		onClose()
	}, [onClose]);

	const onContentClick = useCallback((event) => {
		event.stopPropagation()
	}, []);


	return (
		<div className="user_modal_container" onClick={onContainerClick}>
			<div className="user_modal_content" onClick={onContentClick}>
				<h2>{user.username}</h2>
				<p>Email: {user.email}</p>
				<p>Баланс: <span className={'balance'}>{user.coins}$</span></p>
				<div className="balance_actions">
					<div className="add_balance">
						<input
							type="number"
							value={balanceToAdd}
							onChange={(e) => setBalanceToAdd(parseInt(e.target.value))}
						/>
						<button onClick={handleAddBalance}>Начислить баланс</button>
					</div>
					<div className="subtract_balance">
						<input
							type="number"
							value={balanceToSubtract}
							onChange={(e) => setBalanceToSubtract(parseInt(e.target.value))}
						/>
						<button className={'block'} onClick={handleSubtractBalance}>Отнять баланс</button>
					</div>
				</div>
				<div className={'buttons'}>
					<button className={'block'} onClick={handleBanUser}>Заблокировать пользователя</button>
					<button className={'unblock'} onClick={handleUnbanUser}>Разблокировать пользователя</button>
					<button className={'close'} onClick={onClose}>Закрыть</button>
				</div>
			</div>
		</div>
	);
};

export default UserModal;
