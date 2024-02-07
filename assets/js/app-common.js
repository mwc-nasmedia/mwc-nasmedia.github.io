if (typeof System == "undefined") {

	var System = {};
}

/**
 * Jquery form Serialize to Object
 * @returns {{}}
 */
$.fn.serializeObject = function() {
	"use strict"
	var result = {}
	var extend = function(i, element) {
		var node = result[element.name]
		if ("undefined" !== typeof node && node !== null) {
			if ($.isArray(node)) {
				node.push(element.value)
			} else {
				result[element.name] = [node, element.value]
			}
		} else {
			result[element.name] = element.value
		}
	}

	$.each(this.serializeArray(), extend)
	return result
}

/**
 * Jquery form Serialize to Object for target class
 * @returns {{}}
 */
$.fn.serializeObjectTargetClass = function(targetClass) {
	"use strict"
	var result = {}
	var extend = function(i, element) {
		var node = result[element.name]
		if (($('[name="' + element.name + '"]').hasClass(targetClass))) {
			let setUncomma = false;
			const el       = $('[name="' + element.name + '"]');
			if ($(el).hasClass("number") || $(el).hasClass("float")
				|| $(el).hasClass("USD") || $(el).hasClass("percent")) {
				setUncomma = true;
			}
			if ("undefined" !== typeof node && node !== null) {
				if ($.isArray(node)) {
					const sVal = setUncomma ? unComma(element.value) : element.value;
					node.push(sVal)
				} else {
					const sVal           = setUncomma ? unComma(element.value) : element.value;
					result[element.name] = [node, sVal];
				}
			} else {
				const sVal           = setUncomma ? unComma(element.value) : element.value;
				result[element.name] = sVal;
			}
		}
	}

	$.each(this.serializeArray(), extend)
	return result
}

//form validate 체크 용
//<form 안에  class="needs-validation" novalidate 선언 필수>
$.fn.chkFormValidationRequired = function(sFrmID) {
	const frm = document.getElementById(sFrmID);
	if (frm) {
		frm.classList.add("was-validated");
		if (!frm.checkValidity()) {
			return false;
		}
	}
	return true;
}

$.fn.setInvalidFeedback = function(tAttr, sMsg) {
	let tag = tAttr;
	if (typeof tAttr === "string") {
		tag = $(tAttr);
	}

	tag.addClass("is-invalid-custom");
	tag.parent().find(".invalid-feedback-custom").remove();
	tag.parent().append('<div class="invalid-feedback-custom">' + sMsg + '</div>');
	tag.focus();
};

$.fn.setCheckFormInvalidFeedback = function(tAttr, sMsg) {
	let tag = tAttr;
	if (typeof tAttr === "string") {
		tag = $(tAttr);
	}

	tag.addClass("is-invalid-custom");
	tag.parent().addClass("is-invalid-custom");
	tag.parent().parent().find(".invalid-feedback-custom").remove();
	tag.parent().parent().append('<div class="invalid-feedback-custom">' + sMsg + '</div>');
	tag.focus();
};

$(document).on("click", ".is-invalid-custom", function() {
	$(this).removeClass("is-invalid-custom");
});

$(document).on("keydown", ".is-invalid-custom", function() {
	if($(this).val().trim() != "") {
		$(this).removeClass("is-invalid-custom");
	}
});

$(document).on("click", "input[type='checkbox'].is-invalid-custom, input[type='radio'].is-invalid-custom, select.is-invalid-custom", function() {
	$(this).removeClass("is-invalid-custom");
	$(this).parent().removeClass("is-invalid-custom");
	$(this).parent().siblings().removeClass("is-invalid-custom");
	$(this).parent().siblings().children().removeClass("is-invalid-custom");
});

/**
 * 체크박스에서 전체선택 및 개별 선택 시, 일괄 적용
 * 맨 앞에 class 로 해당하는 체크박스 일괄 적용
 */
$(document).on("click", ".set_checkbox", function() {
	const aClass   = $(this).attr("class").split(" ");
	const sClassNm = aClass[0];

	if ($(this).attr("data-type") === "all") {
		if ($(this).is(":checked")) {
			$("." + sClassNm + ":enabled").prop("checked", true);

		} else {
			$("." + sClassNm + ":enabled").prop("checked", false);
		}

	} else if ($(this).attr("data-type") === "data") {
		if ($("." + sClassNm + "[data-type='data']:enabled:checked").length === $("." + sClassNm + "[data-type='data']:enabled").length) {
			$("." + sClassNm + ":enabled").prop("checked", true);

		} else {
			$("." + sClassNm + "[data-type='all']").prop("checked", false);
		}
	}
});

function initListPageConditions(sFrmID) {
	$("#" + sFrmID)[0].reset();

	// 멀티셀렉트 초기화
	$("select[nas-select2]").each(function() {
		$(this).select2("destroy");
		$(this).select2();
	});

	// datePicker 초기화
	$("input.start_datepicker").val("");
	$("input.end_datepicker").val("");
}

function copyText(sSelectedEl) {
	const clipboard = new ClipboardJS(sSelectedEl);
	clipboard.on("success", function(e) {
		toastrSuccess("텍스트가 복사되었습니다.");

		e.clearSelection();
	});

	clipboard.on("error", function(e) {
		toastrFail("복사에 실패하였습니다.");
	});
}

/**
 * 문자열이 빈 문자열인지 체크하여 결과값을 리턴한다.
 * @param  str      : 체크할 문자열
 * @return boolean  : true/false
 */
function isEmpty(str) {
	return typeof str === "undefined" || str == null || str === "";
}

function isEmptyObj(obj) {
	if (obj.constructor === Object && Object.keys(obj).length === 0) {
		return true;
	}
	return false;
}

/**
 * 문자열이 빈 문자열인지 체크하여 기본 문자열로 리턴한다.
 * @param str           : 체크할 문자열
 * @param defaultStr    : 문자열이 비어있을경우 리턴할 기본 문자열
 * @return String       : ''
 */
function nvl(str, defaultStr) {
	if (typeof str === "undefined" || str == null || str === "")
		str = defaultStr;

	return str;
}

function execCommonAjax(params, callback) {
	const ajaxParams = getDefaultAjaxParams(params);

	$.ajax({
		type          : ajaxParams.type
		, url         : ajaxParams.url
		, dataType    : "json"
		, contentType : "application/json;charset=UTF-8"
		, data        : ajaxParams.data
		, async       : ajaxParams.async
		, beforeSend  : function(xhr) {
			xhr.setRequestHeader("AJAX", "true");

			$("body").append('<div id="screen-lock"><div class="offcanvas-backdrop fade show"></div><div class="spinner-border avatar-sm list-loading"></div></div>');
		}
		, complete:function() {
			$("#screen-lock").remove();
			setCustomTooltip();
		}
		, success     : function(res) {
			if (res.resultCode === SUCCESS_CODE) {
				callback(res.resultData);
			} else if (res.resultCode === GLOBAL_EXCEPTION_ERROR_CODE) {
				swalError(res.resultMessage);
			} else if (res.resultCode === SESSION_EXPIRED_ERROR_CODE) {
				swalInfo("세션이 만료되었습니다", function(bRespResult) {
					if (bRespResult) {
						location.replace("/login/loginForm");
					}
				});
			} else {
				swalError("통신에 실패했습니다.");
			}
		}
		, error       : function(xhr) {
			swalError("통신에 실패했습니다.");
		}
	});
}

function getDefaultAjaxParams(params) {
	params.type  = nvl(params.type, "GET");
	params.data  = nvl(params.data, {});
	params.async = nvl(params.async, true);

	// AJAX 호출 시 권한 코드 설정
	params.data.role = USER_MENU_ROLE;

	return params;
}

let NumberPatternExt = /[^0-9]/g;
//$('.number').on('keyup', function(e) {
$(document).off("keyup", '.number').on('keyup', '.number', function() {
	let sVal     = $(this).val().replace(NumberPatternExt, "");
	let bZero    = $(this).hasClass('zero'); // 0이 가능한 폼일 때
	let bUnComma = $(this).hasClass('uncomma');
	if (bZero && sVal.substr(0, 1) == "0" && sVal.length > 1) sVal = sVal.substring(1);
	if (!bZero && sVal.substr(0, 1) == "0") sVal = sVal.substring(1);

	//입력받을수있는 최대 수. ex. maxsize 가 5라면 5이상 입력시 5가 입력되도록.
	if ($(this).attr('maxvalue') != undefined && Number(sVal) > Number($(this).attr('maxvalue'))) {
		sVal = $(this).attr('maxvalue');
	}

	sVal = (bUnComma) ? sVal : setComma(sVal);
	$(this).val(sVal);
});

// input text 소수점 둘째자리 체크
// <input type="text" class="float minus" /> minus 클래스도 함께 사용하면 마이너스 허용
//$('input:text.float').on('keyup', function(e) {
$(document).off("keyup", 'input:text.float').on('keyup', 'input:text.float', function() {
	var sVal      = unComma($(this).val());
	let bUnComma  = $(this).hasClass('uncomma');
	// 마이너스 허용여부
	var sFirstExp = ($(this).hasClass('minus')) ? /[^-0-9]/g : /[^0-9]/g;
	// 앞자리와 그외 자리수 나눠서 체크
	var sFirst    = sVal.substr(0, 1).replace(sFirstExp, "");
	var sRemain   = sVal.substr(1, sVal.length).replace(/[^0-9.]/g, "");
	sVal          = sFirst + sRemain;

	// 소수점으로 인한 첫째자리 0 사용 이외에 제한
	if (sVal.length > 1 && sVal.substr(0, 1) == "0" && sVal.substr(1, 1) != ".") sVal = "";

	// 최대값 설정
	var nMaxValue = 0;
	if (typeof $(this).attr("maxvalue") !== 'undefined') {
		nMaxValue = parseFloat($(this).attr("maxvalue"));
	}
	if (nMaxValue !== 0 && (sVal > nMaxValue)) {
		sVal = nMaxValue;
	}

	// 소수점 둘째자리까지만 허용
	// point 설정되어있으면 설정된만큼 허용
	var nPoint = 2;
	if (typeof $(this).attr("point") != 'undefined') {
		nPoint = $(this).attr("point");
	}

	if (String(sVal).split('.').length > 1) {
		var sInt   = sVal.split('.')[0];
		var sPoint = sVal.split('.')[1].substr(0, nPoint);
		sVal       = sInt + "." + sPoint;
	}
	sVal = (bUnComma) ? sVal : setComma(sVal);
	$(this).val(sVal);
});

//알파벳인지 체크
isAlphabet = function(str) {
	result = true;
	for (var i = 0; i < str.length; i++) {
		ch         = str.substr(i, 1);
		numUnicode = ch.charCodeAt(0);

		if (!((65 <= numUnicode && numUnicode <= 90) || (97 <= numUnicode && numUnicode <= 122))) result = false;
	}
	return result;
}
//한글인지 체크
isKorean   = function(str) {
	result = true;
	for (var i = 0; i < str.length; i++) {
		ch         = str.substr(i, 1);
		numUnicode = ch.charCodeAt(0);

		if (!((44032 <= numUnicode && numUnicode <= 55203) || (12593 <= numUnicode && numUnicode <= 12643))) result = false;
	}
	return result;
}
//숫자인지 체크
isNumber   = function(str, obj) {
	str = unComma(str);

	result = true;
	for (var i = 0; i < str.length; i++) {
		ch         = str.substr(i, 1);
		numUnicode = ch.charCodeAt(0);

		if (!(48 <= numUnicode && numUnicode <= 57)) result = false;
		else {
			//입력된 숫자 첫째자리가 0일경우 삭제
			if (str.substr(0, 1) == 0 && str.length > 1) {
				str = str.substr(1, (str.length) - 1);
			}
			obj.val(setComma(str));
		}
	}
	return result;
}

//URL 이 맞는지 체크
isUrl = function(url) {
	var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	if (RegExp.test(url)) {
		return true;
	} else {
		return false;
	}
}
//email형식이 맞는지 체크
isEmail = function(email) {
	var RegExp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
	if (RegExp.test(email)) {
		return true;
	} else {
		return false;
	}
}

setComma = function(str) {
	str += '';
	x       = str.split('.');
	x1      = x[0];
	x2      = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

unComma = function(str) {

	return str.replace(/,/gi, "");
}

/**
 * setRound (반올림처리)
 * val            : 값
 * precision    : 소수점
 */
setRound = function(val, precision) {
	val = val * Math.pow(10, precision);
	val = Math.round(val);
	return val / Math.pow(10, precision);
}

/**
 * setFloor (소수점 이하 버림 )
 * val            : 값
 * precision    : 소수점
 */
setFloor = function(val, precision, is_comma) {
	if (typeof precision == "undefined") {
		precision = 2;
	}
	if (val == null || val.length == 0) {
		return '';
	}
	var aVal = val.toString().split(".");

	var _sDecimal = "";

	var _sReturnVal = (is_comma == true) ? setComma(aVal[0]) : aVal[0];

	if (aVal.length > 1 && precision > 0) {
		var _sDecimal = aVal[1].substr(0, precision);
	}

	if (_sDecimal.length < precision) {
		_sDecimal = (_sDecimal * Math.pow(10, precision - _sDecimal.length)).toString();
	}

	return (_sDecimal.length > 0) ? _sReturnVal + "." + _sDecimal : _sReturnVal;
}


/**
 * getRate (비율 계산)
 * a            : 분자
 * b            : 분모
 */
getRate = function(a, b) {

	if (a == undefined) a = 0;
	if (b == undefined) b = 0;

	a = parseFloat(a);
	b = parseFloat(b);

	if (a == 0 || b == 0) {
		return parseFloat(0).toFixed(2);
	}

	var rate = setRound((a / b) * 100, 2);
	rate     = rate.toFixed(2);

	return rate;
}

setCustomTooltip = function() {
	const tooltip = $("*[data-after_tooltip]");

	if(tooltip){
		$(tooltip).each(function(idx, val) {
			const title = $(val).attr('title');
			if(typeof title !=='undefined'){
				$(val).tooltip({
					title: title
				});
			}
		});
	}
}

// Datatables Korean
const dt_lang_kor = {
	"decimal"        : "",
	"emptyTable"     : "데이터가 없습니다.",
	"info"           : "_START_ - _END_ (TOTAL _TOTAL_)",
	"infoEmpty"      : "0",
	"infoFiltered"   : "(전체 _MAX_ 개 중 검색결과)",
	"infoPostFix"    : "",
	"thousands"      : ",",
	"lengthMenu"     : "_MENU_ 개씩 보기",
	"loadingRecords" : "로딩중...",
	"processing"     : "처리중...",
	"search"         : "검색 : ",
	"zeroRecords"    : "검색된 데이터가 없습니다.",
	"paginate"       : {
		"first"    : "첫 페이지",
		"last"     : "마지막 페이지",
		"next"     : "다음",
		"previous" : "이전"
	},
	"aria"           : {
		"sortAscending"  : " :  오름차순 정렬",
		"sortDescending" : " :  내림차순 정렬"
	}
};