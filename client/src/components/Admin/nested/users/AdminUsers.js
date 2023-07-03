import React, {useCallback, useDeferredValue, useEffect, useState} from 'react';
import './AdminUsers.scss';
import {useDispatch, useSelector} from 'react-redux';
import {createSelector} from 'reselect';
import {toast} from "react-toastify";
import {
	getAllUsers,
	addBalance,
	subtractBalance,
	banUser, unbanUser
} from '../../../../store/slices/AdminSlice';
import UserModal from './UserModal';

const AdminUsers = () => {
	const dispatch = useDispatch();
	const users = useSelector(state => state.admin.users);

	useEffect(() => {
		dispatch(getAllUsers());
	}, []);

	const [selectedUser, setSelectedUser] = useState(null);
	const [searchName, setSearchName] = useState('');
	const [searchEmail, setSearchEmail] = useState('');
	const [searchBanned, setSearchBanned] = useState(null);
	const [sortByBalanceAsc, setSortByBalanceAsc] = useState(true);
	const [sortByHighScoreAsc, setSortByHighScoreAsc] = useState(true);
	const [sortByBalance, setSortByBalance] = useState(false);

	const openModal = (user) => {
		setSelectedUser(user);
	};

	const closeModal = () => {
		setSelectedUser(null);
	};

	const handleAddBalance = (userId, add) => {
		dispatch(addBalance({userId, add}))
			.then((response) => {
				if (response.type.toLowerCase().includes("rejected")) {
					toast.error('Ошибка при увеличении баланса');
				} else {
					toast.success('Баланс успешно увеличен');
					dispatch(getAllUsers());
				}
			})
	};

	const handleSubtractBalance = (userId, sub) => {
		dispatch(subtractBalance({userId, sub}))
			.then((response) => {
				if (response.type.toLowerCase().includes("rejected")) {
					toast.error('Ошибка при уменьшении баланса');
				} else {
					toast.success('Баланс успешно уменьшен');
					dispatch(getAllUsers());
				}
			})
	};

	const handleBanUser = (userId) => {
		dispatch(banUser(userId))
			.then((response) => {
				if (response.type.toLowerCase().includes("rejected")) {
					toast.error('Ошибка при блокировке пользователя');
				} else {
					toast.success('Пользователь успешно заблокирован');
					dispatch(getAllUsers());
				}
			})
	};

	const handleUnbanUser = (userId) => {
		dispatch(unbanUser(userId))
			.then((response) => {
				toast.success('Пользователь успешно разблокирован');
				dispatch(getAllUsers());
			})
			.catch((error) => {
				toast.error('Ошибка при разблокировке пользователя');
			});
	};

	const searchByNameSelector = createSelector(
		state => state.admin.users,
		users => users.filter(user => user.username.toLowerCase().includes(searchName.toLowerCase()))
	);

	const searchByEmailSelector = createSelector(
		searchByNameSelector,
		users => users.filter(user => user.email.toLowerCase().includes(searchEmail.toLowerCase()))
	);

	const searchBannedSelector = createSelector(
		searchByEmailSelector,
		users => {
			if (searchBanned === true) {
				return users.filter(user => user.isBanned);
			} else if (searchBanned === false) {
				return users.filter(user => !user.isBanned);
			} else {
				return users;
			}
		}
	);

	const sortByBalanceOrScoreSelector = createSelector(
		searchBannedSelector,
		users => {
			if (sortByBalance) {
				return users.sort((a, b) => {
					if (sortByBalanceAsc) {
						return a.coins - b.coins;
					} else {
						return b.coins - a.coins;
					}
				});
			} else {
				return users.sort((a, b) => {
					if (sortByHighScoreAsc) {
						return getHighScore(a) - getHighScore(b);
					} else {
						return getHighScore(b) - getHighScore(a);
					}
				});
			}
		}
	);

	const filteredItems = useSelector(sortByBalanceOrScoreSelector)
	const deferredFilteredUsers = useDeferredValue(filteredItems);
	const onBalanceSortClick = useCallback((event) => {
		setSortByBalanceAsc(!sortByBalanceAsc)
		setSortByBalance(true)
	}, [sortByBalanceAsc]);
	const onRatingSortClick = useCallback((event) => {
		setSortByHighScoreAsc(!sortByHighScoreAsc)
		setSortByBalance(false)
	}, [sortByHighScoreAsc]);


	return (
		<div className="admin_container">
			<h1>Admin Panel</h1>
			<div className="filters">
				<div className="filter">
					<label htmlFor="nameFilter">Имя пользователя:</label>
					<input
						id="nameFilter"
						type="text"
						placeholder="Имя пользователя"
						value={searchName}
						onChange={(e) => setSearchName(e.target.value)}
					/>
				</div>
				<div className="filter">
					<label htmlFor="emailFilter">Email:</label>
					<input
						id="emailFilter"
						type="text"
						placeholder="Email"
						value={searchEmail}
						onChange={(e) => setSearchEmail(e.target.value)}
					/>
				</div>
				<div className="filter">
					<label htmlFor="bannedFilter">Заблокированные:</label>
					<select
						id="bannedFilter"
						value={searchBanned === null ? '' : searchBanned}
						onChange={(e) =>
							setSearchBanned(e.target.value === 'true' ? true : e.target.value === 'false' ? false : null)
						}
					>
						<option value="">Все</option>
						<option value="true">Заблокированные</option>
						<option value="false">Незаблокированные</option>
					</select>
				</div>
				<button className="clearFiltersBtn" onClick={() => {
					setSearchName('');
					setSearchEmail('');
					setSearchBanned(null);
				}}>Очистить фильтры
				</button>
			</div>
			<table className="user_table">
				{/* Table headers */}
				<thead>
				<tr>
					<th>ID</th>
					<th>Имя пользователя</th>
					<th>Email</th>
					<th>Роль</th>
					<th>
						Баланс
						<button onClick={onBalanceSortClick}>
							{sortByBalanceAsc ? '▲' : '▼'}
						</button>
					</th>
					<th>
						Рекорд
						<button onClick={onRatingSortClick}>
							{sortByHighScoreAsc ? '▲' : '▼'}
						</button>
					</th>
					<th>Заблокирован</th>
					<th>Действия</th>
				</tr>
				</thead>
				<tbody>
				{deferredFilteredUsers.map(user => (
					<tr key={user.id}>
						<td>{user.id}</td>
						<td>{user.username}</td>
						<td>{user.email}</td>
						<td>{user.userRole}</td>
						<td><span className={'balance'}>{user.coins}$</span></td>
						<td>{getHighScore(user)}</td>
						<td style={{color: user.isBanned ? 'red' : 'green'}}>
							{user.isBanned ? 'Да' : 'Нет'}
						</td>
						<td>
							<button onClick={() => openModal(user)}>Открыть</button>
						</td>
					</tr>
				))}
				</tbody>
			</table>
			{selectedUser && (
				<UserModal
					user={selectedUser}
					onClose={closeModal}
					onAddBalance={handleAddBalance}
					onSubtractBalance={handleSubtractBalance}
					onBanUser={handleBanUser}
					onUnbanUser={handleUnbanUser}
				/>
			)}
		</div>
	);
};

function getHighScore(user) {
	const scores = user.leaderboardScores.map(score => score.score);
	const highScore = Math.max(...scores);
	return highScore || '-';
}

export default AdminUsers;
