// @ts-check
import firebase from "./firebase";
import uuidV1 from "uuid/v1";

export function acceptOrder(orderId) {
	const orderRef = firebase
		.firestore()
		.collection("orders")
		.doc(orderId);

	return orderRef.update({ status: "in progress" });
}

export function rejectOrder(orderId) {
	const orderRef = firebase
		.firestore()
		.collection("orders")
		.doc(orderId);

	return orderRef.update({ status: "rejected" });
}

export function requestOrderChanges(orderId, changes) {
	const orderRef = firebase
		.firestore()
		.collection("orders")
		.doc(orderId);

	return orderRef.update({ status: "changes requested", changes });
}

/**
 * Changes the status of an order to completed
 *
 * @export
 * @param {*} orderId
 * @returns promise fo the update firestore method
 */
export function completeOrder(orderId) {
	const orderRef = firebase
		.firestore()
		.collection("orders")
		.doc(orderId);

	return orderRef.update({ status: "completed" });
}

export function persistOrderResults(orderId, resultType, results) {
	const serverTime = firebase.firestore.FieldValue.serverTimestamp();
	const update = { [resultType]: {...results}, updatedAt: serverTime };
	return firebase
		.firestore()
		.collection("orders")
		.doc(orderId)
		.update(update);
}

export function persistOrderEmbeddedResults(orderId, resultType, resultKey, results) {
	const serverTime = firebase.firestore.FieldValue.serverTimestamp();
	const update = { [`${resultType}.${resultKey.toString()}`]: {...results, updatedAt: serverTime }};
	return firebase
		.firestore()
		.collection("orders")
		.doc(orderId)
		.update(update);
}


/**
 * Uploads a given file to the destination folder in the default bucket
 *
 * @export
 * @param {string} file the reference to the file
 * @param {string} folder the remote folder you will be storing the file in
 * @returns {promise} to the firebase storage put method
 */
export function uploadFile(file, folder) {
	if (!folder) {
		throw new Error("You must specify what folder to upload the file in!");
	}
	const fileName = uuidV1() + "___" + file.name;
	const storageRef = firebase.storage().ref(`${folder}/`);
	return storageRef.child(fileName).put(file);
}

/**
 * Creates a new order given the specific details and the services needed.
 *
 * @export
 * @param {*} object {
 * 	firstName,
 * 	lastName,
 * 	middleName,
 * 	dateOfBirth,
 * 	address,
 * 	gender,
 * 	screeningTypes,
 * 	assetsURL,
 * 	organizationId,
 * 	organizationName
 * }
 * @returns {*} promise batch commit
 */
export function createOrder({
	firstName,
	lastName,
	middleName,
	dateOfBirth,
	address,
	gender,
	screeningTypes = [],
	assetsURL,
	organizationId,
	organizationName
}) {
	// Creates new orders and sets up new sub documents to keep track of the results
	const serverTime = firebase.firestore.FieldValue.serverTimestamp();
	const user = firebase.auth().currentUser;
	if (!user) {
		throw new Error("You must be registered to create an order!");
	}

	const sreenings = {};
	screeningTypes.forEach(type => (sreenings[type] = {}));

	return firebase
		.firestore()
		.collection("orders")
		.add({
			firstName,
			lastName,
			middleName,
			dateOfBirth,
			address,
			gender,
			screeningTypes,
			...sreenings,
			organizationId,
			organizationName,
			assetsURL,
			status: "pending",
			notes: "",
			referenceNumber: generateOrderRefNo(organizationName),
			createdAt: serverTime,
			updatedAt: serverTime
		});
}

export function generateOrderRefNo(companyName = "") {
	let abbreviation = "";
	if (companyName.length > 3 && companyName.split(" ").length > 1) {
		abbreviation = companyName
			.split(" ")
			.map(el => el[0])
			.join("")
			.toUpperCase();
	} else if (companyName.length > 3 && companyName.split(" ").length <= 1) {
		abbreviation = companyName.substr(0, 3).toUpperCase();
	} else {
		abbreviation = companyName;
	}

	const d = new Date();
	const rand = Math.random()
		.toString(36)
		.replace("0.", "")
		.substr(6);
	return `${abbreviation}/${d.getMonth() + 1}/${d.getFullYear()}/${rand}`;
}

export function fullFormatDate(timeStamp) {
	const dateObj = new Date(timeStamp);

	const date = dateObj.getDate();
	const year = dateObj.getFullYear();

	return `${date} ${getMonthName(dateObj)} ${year}`;
}

export function getMonthName(timeStamp) {
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	return months[new Date(timeStamp).getMonth()];
}

export function friendlyFormatMoney(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function friendlyFormatDate(timeStamp) {
	const dateObj = new Date(timeStamp);

	const date = dateObj.getDate();
	const month = dateObj.getMonth() + 1;
	const year = dateObj.getFullYear();

	return `${date}/${month}/${year}`;
}
