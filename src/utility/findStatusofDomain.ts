export function findStatus(currentDate: Date, expirationDate: Date): string {
    if (currentDate < expirationDate) {
        return "active";
    } else {
        return "expired";
    }
}
