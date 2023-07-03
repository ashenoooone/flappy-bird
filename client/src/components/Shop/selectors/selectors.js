import {createSelector} from "@reduxjs/toolkit";

export const getMySkinsSelector = (state => state?.shop.mySkins)
export const getAllSkinsSelector = (state => state?.shop.allSkins)

export const getSkinsToBuy = createSelector(
	getAllSkinsSelector,
	getMySkinsSelector,
	(allSkins, mySkins) => {
		const mySkinsIds = mySkins.map((item) => item.id)
		return allSkins.filter((item) => !mySkinsIds.includes(item.id))
	})