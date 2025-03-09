// メッセージリスナーを設定
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "fillForm") {
		const success = fillForm(request.userData);
		sendResponse({ success: success });
	}
	return true; // 非同期レスポンスを有効にする
});

// フォームに自動入力する関数
function fillForm(userData) {
	try {
		// フォームが存在するか確認
		const form = document.querySelector("form.edit_apply");
		if (!form) {
			console.error("フォームが見つかりません");
			return false;
		}

		// 記号
		const signNoInput = document.getElementById("apply_sign_no");
		if (signNoInput) {
			signNoInput.value = userData.sign_no || "";
		}

		// 番号
		const insuredNoInput = document.getElementById("apply_insured_no");
		if (insuredNoInput) {
			insuredNoInput.value = userData.insured_no || "";
		}

		// 事業所名
		const officeNameInput = document.getElementById("apply_office_name");
		if (officeNameInput) {
			officeNameInput.value = userData.office_name || "";
		}

		// 申込代表者名（カナ氏名）
		const kanaNameInput = document.getElementById("apply_kana_name");
		if (kanaNameInput) {
			kanaNameInput.value = userData.kana_name || "";
		}

		// 生年月日
		const yearSelect = document.getElementById("apply_year");
		if (yearSelect && userData.birth_year) {
			yearSelect.value = userData.birth_year;
			// 年が変更されたときのイベントをトリガー
			const event = new Event("change");
			yearSelect.dispatchEvent(event);
		}

		const monthSelect = document.getElementById("apply_month");
		if (monthSelect && userData.birth_month) {
			monthSelect.value = userData.birth_month;
			// 月が変更されたときのイベントをトリガー
			const event = new Event("change");
			monthSelect.dispatchEvent(event);
		}

		// 日付選択の更新を待つ
		setTimeout(() => {
			const daySelect = document.getElementById("apply_day");
			if (daySelect && userData.birth_day) {
				daySelect.value = userData.birth_day;
			}
		}, 100);

		// 性別
		const genderSelect = document.getElementById("apply_gender");
		if (genderSelect) {
			genderSelect.value = userData.gender || "man";
		}

		// 続柄
		const relationshipSelect = document.getElementById("apply_relationship");
		if (relationshipSelect) {
			relationshipSelect.value = userData.relationship || "myself";
			// 続柄が変更されたときのイベントをトリガー
			const event = new Event("change");
			relationshipSelect.dispatchEvent(event);
		}

		// 連絡先電話番号
		const contactPhoneInput = document.getElementById("apply_contact_phone");
		if (contactPhoneInput) {
			contactPhoneInput.value = userData.contact_phone || "";
		}

		// 郵便番号
		const postalInput = document.getElementById("apply_postal");
		if (postalInput) {
			postalInput.value = userData.postal || "";
			// 郵便番号が入力されたときのイベントをトリガー
			const event = new Event("blur");
			postalInput.dispatchEvent(event);
		}

		// 郵便番号から住所が自動入力されるのを待つ
		setTimeout(() => {
			// 都道府県
			const stateSelect = document.getElementById("apply_state");
			if (stateSelect) {
				stateSelect.value = userData.state || "";
			}

			// 住所
			const addressInput = document.getElementById("apply_address");
			if (addressInput) {
				addressInput.value = userData.address || "";
			}

			// 宿泊人数
			const stayPersonsInput = document.getElementById("apply_stay_persons");
			if (stayPersonsInput && userData.stay_persons) {
				stayPersonsInput.value = userData.stay_persons;
			}

			// 希望部屋数
			const hopeRoomsSelect = document.getElementById("house_select");
			if (hopeRoomsSelect && userData.hope_rooms) {
				hopeRoomsSelect.value = userData.hope_rooms;
				// 部屋数が変更されたときのイベントをトリガー
				const event = new Event("change");
				hopeRoomsSelect.dispatchEvent(event);

				// 部屋数に応じた部屋人数入力欄を表示させるために少し待つ
				setTimeout(() => {
					// 各部屋の人数入力欄が表示されたら入力する
					// 現時点では1部屋目のみ入力（必要に応じて拡張可能）
					const hopeRoom1Input = document.getElementById("apply_hope_room1");
					if (hopeRoom1Input && userData.stay_persons) {
						hopeRoom1Input.value = userData.stay_persons;
					}
				}, 200);
			}
		}, 500);

		return true;
	} catch (error) {
		console.error("フォーム入力中にエラーが発生しました:", error);
		return false;
	}
}
