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
	if (!role) return false;
	// Viewers are read-only and cannot modify any dashboard entities
	return role !== "viewer";
}

export function isSuperAdmin() {
	return getCurrentRole() === "super_admin";
}
