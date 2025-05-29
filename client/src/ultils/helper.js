import icons from "./icons";

const { BiSolidStar, BiStar } = icons;

export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");

export const formatMoney = (number) =>
  Number(number?.toFixed(1)).toLocaleString();

export const renderStarFromNumber = (number, size) => {
  const stars = [];
  number = Math.round(number);
  for (let i = 0; i < +number; i++)
    stars.push(<BiSolidStar color="orange" size={size || 16}></BiSolidStar>);
  for (let i = 5; i > +number; i--)
    stars.push(<BiStar color="orange" size={size || 16}></BiStar>);
  return stars;
};

export const validate = (payload, setInvaliFields) => {
  let invalids = 0;
  const fomatPayload = Object.entries(payload);
  for (let arr of fomatPayload) {
    if (arr[1].trim() === "") {
      invalids++;
      setInvaliFields((prev) => [
        ...prev,
        { name: arr[0], mes: "Require this field." },
      ]);
    }
  }

  for (let arr of fomatPayload) {
    switch (arr[0]) {
      case "email":
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!arr[1].match(regex)) {
          invalids++;
          setInvaliFields((prev) => [
            ...prev,
            { name: arr[0], mes: "Email invalid." },
          ]);
        }
        break;

      case "password":
        if (arr[1].length < 1) {
          invalids++;
          setInvaliFields((prev) => [
            ...prev,
            { name: arr[0], mes: "Password minimum 1 characters." },
          ]);
        }
        break;

      default:
        break;
    }
  }

  return invalids;
};

export const fotmatPrice = (number) => Math.round(number / 1000) * 1000;

export const generateRange = (start, end) => {
  const length = end + 1 - start;
  return Array.from({ length }, (_, index) => start + index);
};

export function getBase64(file) {
  if (!file) return "";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const getColorClass = (colorInt) => {
  switch (colorInt) {
    case "red":
      return "bg-red-500";
    case "green":
      return "bg-green-500";
    case "blue":
      return "bg-blue-500";
    case "yellow":
      return "bg-yellow-500";
    case "orange":
      return "bg-orange-500";
    case "purple":
      return "bg-purple-500";
    case "brown":
      return "bg-neutral-500";
    case "black":
      return "bg-black";
    case "white":
      return "bg-slate-100";
    case "gray":
      return "bg-gray-500";
    default:
      return "";
  }
};
