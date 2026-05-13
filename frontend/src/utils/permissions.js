export function getCurrentRole() {
	try {
		const user = JSON.parse(localStorage.getItem("user") || "{}");
		return user.role || null;
	} catch (e) {
		return null;
	}
}

export function canModify() {
	const role = getCurrentRole();
	// Admin users are not allowed to edit or delete anything per policy
	if (!role) return false;
	return role !== "admin";
}

export function isSuperAdmin() {
	return getCurrentRole() === "super_admin";
}
