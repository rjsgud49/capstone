export const formatKoreanCurrency = (amount) => {
    if (typeof amount !== "number") return amount;

    const billion = Math.floor(amount / 10000);
    const million = amount % 10000;

    let result = "";
    if (billion > 0) result += `${billion}억 `;
    if (million > 0) result += `${million}만원`;
    if (billion > 0 && million === 0) result += "원";
    if (result === "") result = "0원";

    return result.trim();
};