import React from 'react';
import './Admin.scss';
import {Link} from "react-router-dom";

const Admin = () => {
	return (
		<div className="admin-panel">
			<div className="admin-section users-section">
				<h2 className="section-title">Работа с пользователями</h2>
				<p className="section-description">Управление пользователями сайта</p>
				<Link to="/admin/users" className="section-link">Перейти</Link>
			</div>
			<div className="admin-section skins-section">
				<h2 className="section-title">Работа со скинами</h2>
				<p className="section-description">Управление скинами для сайта</p>
				<Link to="/admin/skins" className="section-link">Перейти</Link>
			</div>
		</div>
	);
};

export default Admin;
