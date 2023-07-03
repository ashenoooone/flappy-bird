import React, {useCallback, useEffect} from 'react';
import './ShopPage.scss';
import {useDispatch, useSelector} from "react-redux";
import {buySkin, getAllSkins, getMySkins} from "../../store/slices/ShopSlice";
import {$api} from "../../api/api";
import {getMySkinsSelector, getSkinsToBuy} from "./selectors/selectors";
import {toast} from "react-toastify";
import {loginUser, updateUser} from "../../store/slices/UserSlice";

const ShopPage = () => {

	const dispatch = useDispatch()

	const mySkins = useSelector(getMySkinsSelector)
	const skinsToBuy = useSelector(getSkinsToBuy)
	const balance = useSelector(state => state.user.coins)
	const user = useSelector(state => state.user)

	useEffect(() => {
		dispatch(loginUser({jwt: localStorage.getItem("jwt")}))
		dispatch(getMySkins())
		dispatch(getAllSkins())
	}, []);

	const onBuyClick = useCallback((event) => {
		dispatch(buySkin({skinId: event.target.id}))
			.then((res) => {
				if (res.type.toLowerCase().includes("rejected")) {
					toast("Недостаточно средств", {
						type: "error",
						autoClose: 2000,
					})
				} else {
					toast("Скин успешно куплен", {
						type: "success",
						autoClose: 2000,
					})
					dispatch(getMySkins())
					dispatch(getAllSkins())
					dispatch(loginUser({jwt: localStorage.getItem("jwt")}))
				}
			})
	}, [dispatch]);


	const onSelectSkinClick = useCallback((event) => {
		dispatch(updateUser({skinId: event.target.id}))
			.then((res) => {
				if (res.type.toLowerCase().includes("rejected")) {
					toast("Ошибка при обновлении", {
						type: "error",
						autoClose: 2000,
					})
				} else {
					toast("Скин успешно обновлен", {
						type: "success",
						autoClose: 2000,
					})
					dispatch(loginUser({jwt: localStorage.getItem("jwt")}))
				}
			})
	}, [dispatch]);


	return (
		<div className="shop-page">
			<div className="balance">
				<h2>Ваш баланс <span className={'balance'}>{balance}$</span></h2>
			</div>
			<div className="current-skins">
				<h2>Ваши текущие скины</h2>
				<ul className={"skins"}>
					{
						mySkins?.map((skin) => {
							return (
								<li className={`skin-card ${skin.id === user.settings.selectedSkinId && 'skin-card_selected'}`}
										key={Math.random()}>
									<img className="image" src={`${$api.defaults.baseURL}${skin.imageURL}`} alt=""/>
									<div className="skin-details">
										<span className="skin-name">{skin.name}</span>
										<span className="skin-price">{skin.cost} $</span>
									</div>
									{skin.id !== user.settings.selectedSkinId ?
										<button id={skin.id} className="skin_button" onClick={onSelectSkinClick}>Выбрать</button>
										:
										<button id={skin.id} className="skin_button_selected" onClick={onSelectSkinClick}>Выбран</button>
									}
								</li>
							)
						})
					}
				</ul>
			</div>
			<div className="current-skins">
				<h2>Все скины</h2>
				{
					skinsToBuy && skinsToBuy.length === 0 && <span>Все скины куплены</span>
				}
				<ul className={'skins'}>
					{skinsToBuy && skinsToBuy.length > 0 &&
						skinsToBuy?.map((skin) => {
							return (
								<li className="skin-card" key={Math.random()}>
									<img className="image" src={`${$api.defaults.baseURL}${skin.imageURL}`} alt=""/>
									<div className="skin-details">
										<span className="skin-name">{skin.name}</span>
										<span className="skin-price">{skin.cost} $</span>
									</div>
									<button id={skin.id} className="skin_button" onClick={onBuyClick}>купить</button>
								</li>
							);
						})
					}
				</ul>
			</div>
		</div>
	);
};

export default ShopPage;
