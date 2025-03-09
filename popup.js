document.addEventListener("DOMContentLoaded", () => {
	// タブ切り替え機能
	document.getElementById("settingsTab").addEventListener("click", () => {
		openTab("settings");
	});

	document.getElementById("fillTab").addEventListener("click", () => {
		openTab("fill");
	});

	// 生年月日のセレクトボックスを初期化
	initBirthDateSelects();

	// 都道府県のセレクトボックスを初期化
	initPrefectureSelect();

	// 保存ボタンのイベントリスナー
	document.getElementById("saveButton").addEventListener("click", saveUserData);

	// 自動入力ボタンのイベントリスナー
	document.getElementById("fillButton").addEventListener("click", fillForm);

	// モーダルを閉じるボタンのイベントリスナー
	document.getElementById("closeModal").addEventListener("click", closeModal);

	// 保存されたデータを読み込む
	loadUserData();
});

// タブを切り替える関数
function openTab(tabName) {
	const settingsTab = document.getElementById("settingsTab");
	const fillTab = document.getElementById("fillTab");
	const settingsContent = document.getElementById("settings");
	const fillContent = document.getElementById("fill");

	if (tabName === "settings") {
		settingsTab.classList.add("tab-active");
		settingsTab.classList.remove("tab-inactive");
		fillTab.classList.add("tab-inactive");
		fillTab.classList.remove("tab-active");

		settingsContent.classList.remove("hidden");
		fillContent.classList.add("hidden");
	} else {
		fillTab.classList.add("tab-active");
		fillTab.classList.remove("tab-inactive");
		settingsTab.classList.add("tab-inactive");
		settingsTab.classList.remove("tab-active");

		fillContent.classList.remove("hidden");
		settingsContent.classList.add("hidden");
	}
}

// 生年月日のセレクトボックスを初期化する関数
function initBirthDateSelects() {
	const yearSelect = document.getElementById("birth_year");
	const monthSelect = document.getElementById("birth_month");
	const daySelect = document.getElementById("birth_day");

	// 年の選択肢を追加（1925年から現在まで）
	const currentYear = new Date().getFullYear();
	for (let year = 1925; year <= currentYear; year++) {
		const option = document.createElement("option");
		option.value = year;

		// 元号を追加
		let eraYear = "";
		if (year >= 2019) {
			eraYear = `令和${year - 2018}年(${year}年)`;
		} else if (year >= 1989) {
			eraYear = `平成${year - 1988}年(${year}年)`;
		} else if (year >= 1926) {
			eraYear = `昭和${year - 1925}年(${year}年)`;
		} else {
			eraYear = `大正${year - 1911}年(${year}年)`;
		}

		option.textContent = eraYear;
		yearSelect.appendChild(option);
	}

	// 月の選択肢を追加
	for (let month = 1; month <= 12; month++) {
		const option = document.createElement("option");
		option.value = month;
		option.textContent = month;
		monthSelect.appendChild(option);
	}

	// 日の選択肢を追加（とりあえず31日まで）
	updateDaySelect();

	// 年や月が変更されたときに日の選択肢を更新
	yearSelect.addEventListener("change", updateDaySelect);
	monthSelect.addEventListener("change", updateDaySelect);
}

// 日の選択肢を更新する関数
function updateDaySelect() {
	const yearSelect = document.getElementById("birth_year");
	const monthSelect = document.getElementById("birth_month");
	const daySelect = document.getElementById("birth_day");

	const year = Number.parseInt(yearSelect.value) || new Date().getFullYear();
	const month = Number.parseInt(monthSelect.value) || 1;

	// 選択された月の最終日を取得
	const lastDay = new Date(year, month, 0).getDate();

	// 現在選択されている日を保存
	const selectedDay = daySelect.value;

	// 日の選択肢をクリア
	daySelect.innerHTML = "";

	// 日の選択肢を追加
	for (let day = 1; day <= lastDay; day++) {
		const option = document.createElement("option");
		option.value = day;
		option.textContent = day;
		daySelect.appendChild(option);
	}

	// 以前選択されていた日が有効であれば再選択
	if (selectedDay && selectedDay <= lastDay) {
		daySelect.value = selectedDay;
	}
}

// 都道府県のセレクトボックスを初期化する関数
function initPrefectureSelect() {
	const stateSelect = document.getElementById("state");
	const prefectures = [
		{ value: "1", text: "北海道" },
		{ value: "2", text: "青森県" },
		{ value: "3", text: "岩手県" },
		{ value: "4", text: "宮城県" },
		{ value: "5", text: "秋田県" },
		{ value: "6", text: "山形県" },
		{ value: "7", text: "福島県" },
		{ value: "8", text: "茨城県" },
		{ value: "9", text: "栃木県" },
		{ value: "10", text: "群馬県" },
		{ value: "11", text: "埼玉県" },
		{ value: "12", text: "千葉県" },
		{ value: "13", text: "東京都" },
		{ value: "14", text: "神奈川県" },
		{ value: "15", text: "新潟県" },
		{ value: "16", text: "富山県" },
		{ value: "17", text: "石川県" },
		{ value: "18", text: "福井県" },
		{ value: "19", text: "山梨県" },
		{ value: "20", text: "長野県" },
		{ value: "21", text: "岐阜県" },
		{ value: "22", text: "静岡県" },
		{ value: "23", text: "愛知県" },
		{ value: "24", text: "三重県" },
		{ value: "25", text: "滋賀県" },
		{ value: "26", text: "京都府" },
		{ value: "27", text: "大阪府" },
		{ value: "28", text: "兵庫県" },
		{ value: "29", text: "奈良県" },
		{ value: "30", text: "和歌山県" },
		{ value: "31", text: "鳥取県" },
		{ value: "32", text: "島根県" },
		{ value: "33", text: "岡山県" },
		{ value: "34", text: "広島県" },
		{ value: "35", text: "山口県" },
		{ value: "36", text: "徳島県" },
		{ value: "37", text: "香川県" },
		{ value: "38", text: "愛媛県" },
		{ value: "39", text: "高知県" },
		{ value: "40", text: "福岡県" },
		{ value: "41", text: "佐賀県" },
		{ value: "42", text: "長崎県" },
		{ value: "43", text: "熊本県" },
		{ value: "44", text: "大分県" },
		{ value: "45", text: "宮崎県" },
		{ value: "46", text: "鹿児島県" },
		{ value: "47", text: "沖縄県" },
	];

	// 空のオプションを追加
	const emptyOption = document.createElement("option");
	emptyOption.value = "";
	emptyOption.textContent = "選択してください";
	stateSelect.appendChild(emptyOption);

	// 都道府県の選択肢を追加
	for (const prefecture of prefectures) {
		const option = document.createElement("option");
		option.value = prefecture.value;
		option.textContent = prefecture.text;
		stateSelect.appendChild(option);
	}
}

// モーダルを表示する関数
function showModal() {
	const modal = document.getElementById("luckyModal");
	modal.classList.add("visible");
	modal.classList.remove("hidden");
}

// モーダルを閉じる関数
function closeModal() {
	const modal = document.getElementById("luckyModal");
	modal.classList.remove("visible");
	modal.classList.add("hidden");
}

// ユーザーデータを保存する関数
function saveUserData() {
	const userData = {
		sign_no: document.getElementById("sign_no").value,
		insured_no: document.getElementById("insured_no").value,
		office_name: document.getElementById("office_name").value,
		kana_name: document.getElementById("kana_name").value,
		birth_year: document.getElementById("birth_year").value,
		birth_month: document.getElementById("birth_month").value,
		birth_day: document.getElementById("birth_day").value,
		gender: document.getElementById("gender").value,
		relationship: document.getElementById("relationship").value,
		contact_phone: document.getElementById("contact_phone").value,
		postal: document.getElementById("postal").value,
		state: document.getElementById("state").value,
		address: document.getElementById("address").value,
		stay_persons: document.getElementById("stay_persons").value,
		hope_rooms: document.getElementById("hope_rooms").value,
	};

	// Chrome Storageに暗号化せずに保存（セキュリティ上の理由から、実際の実装では暗号化を検討）
	chrome.storage.sync.set({ userData: userData }, () => {
		const status = document.getElementById("status");
		status.textContent = "設定を保存しました！";
		status.className = "status success";

		setTimeout(() => {
			status.textContent = "";
			status.className = "status";
		}, 3000);
	});
}

// 保存されたユーザーデータを読み込む関数
function loadUserData() {
	chrome.storage.sync.get("userData", (data) => {
		if (data.userData) {
			document.getElementById("sign_no").value = data.userData.sign_no || "";
			document.getElementById("insured_no").value =
				data.userData.insured_no || "";
			document.getElementById("office_name").value =
				data.userData.office_name || "";
			document.getElementById("kana_name").value =
				data.userData.kana_name || "";

			if (data.userData.birth_year) {
				document.getElementById("birth_year").value = data.userData.birth_year;
			}

			if (data.userData.birth_month) {
				document.getElementById("birth_month").value =
					data.userData.birth_month;
			}

			updateDaySelect(); // 日の選択肢を更新

			if (data.userData.birth_day) {
				document.getElementById("birth_day").value = data.userData.birth_day;
			}

			document.getElementById("gender").value = data.userData.gender || "man";
			document.getElementById("relationship").value =
				data.userData.relationship || "myself";
			document.getElementById("contact_phone").value =
				data.userData.contact_phone || "";
			document.getElementById("postal").value = data.userData.postal || "";
			document.getElementById("state").value = data.userData.state || "";
			document.getElementById("address").value = data.userData.address || "";

			// 宿泊情報の読み込み
			document.getElementById("stay_persons").value =
				data.userData.stay_persons || "";
			document.getElementById("hope_rooms").value =
				data.userData.hope_rooms || "1";
		}
	});
}

// フォームに自動入力する関数
function fillForm() {
	chrome.storage.sync.get("userData", (data) => {
		if (data.userData) {
			// アクティブなタブでコンテンツスクリプトを実行
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				chrome.tabs.sendMessage(
					tabs[0].id,
					{
						action: "fillForm",
						userData: data.userData,
					},
					(response) => {
						const fillStatus = document.getElementById("fillStatus");

						if (response?.success) {
							fillStatus.textContent = "フォームに入力しました！";
							fillStatus.className = "status success";

							// 自動入力成功時にモーダルを表示
							showModal();
						} else {
							fillStatus.textContent =
								"入力に失敗しました。正しいページで実行してください。";
							fillStatus.className = "status error";
						}

						setTimeout(() => {
							fillStatus.textContent = "";
							fillStatus.className = "status";
						}, 3000);
					},
				);
			});
		} else {
			const fillStatus = document.getElementById("fillStatus");
			fillStatus.textContent =
				"保存されたデータがありません。先に設定を保存してください。";
			fillStatus.className = "status error";

			setTimeout(() => {
				fillStatus.textContent = "";
				fillStatus.className = "status";
			}, 3000);
		}
	});
}
