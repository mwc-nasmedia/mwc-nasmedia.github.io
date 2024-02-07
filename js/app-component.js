if (typeof System == "undefined") {

	var System = {};
}

/**
 * date picker
 *
 * options.sCalenderType    	= (single/range)달력 타입 (default:range)
 * options.bPredefinedRange		= (true/false)predefined 사용 여부 (default:true)
 * options.sDateType         	= (day/time)날짜 형식 타입 (time|date(default))
 * options.sInputType         	= (search/input) 용도 (search|input(default))
 * options.sMinDate          	= (string)선택 최소 날짜
 * options.sMaxDate				= (string)선택 최대 날짜
 */

$.fn.setDatePicker = function(options) {
	options = setDatePickerOptions(options);

	const container = $(this);

	$(document).on("click", ".cancelBtn", function() {
		container.val("");
		$("input.start_datepicker").val("");
		$("input.end_datepicker").val("");
	});

	if (container.length > 0) {
		container.prop("readonly", true);
		setDatePickerTpl(container, options);
	}

	let sForm = options.sDateFormat;

	container.daterangepicker({
		showDropdowns       : true,
		autoUpdateInput     : options.bAutoUpdateInput,
		alwaysShowCalendars : true,
		startDate           : options.sStartDate,
		endDate             : options.sEndDate,
		singleDatePicker    : options.bSingleDatepicker,
		timePicker          : options.bTimePicker,
		timePicker24Hour    : options.bTimePicker24Hour,
		timePickerIncrement : options.bTimePickerIncrement,
		minDate             : options.sMinDate,
		maxDate             : options.sMaxDate,
		ranges              : options.ranges,
		locale              : options.locale

	}, function(start, end) {
		const selectedStartDate = start.format(sForm) // selected start
		const selectedEndDate   = end.format(sForm) // selected end

		const $checkinInput  = $('input.start_datepicker', container)
		const $checkoutInput = $('input.end_datepicker', container)

		$checkinInput.val(selectedStartDate);
		$checkoutInput.val(selectedEndDate);

		const checkOutPicker = $checkoutInput.parent().data('daterangepicker')
		if (checkOutPicker) {
			checkOutPicker.setStartDate(selectedStartDate);
			checkOutPicker.setEndDate(selectedEndDate);
		}

		const checkInPicker = $checkinInput.parent().data('daterangepicker')
		if (checkInPicker) {
			checkInPicker.setStartDate(selectedStartDate);
			checkInPicker.setEndDate(selectedEndDate);
			container.trigger('change');
		}

	});
} // setDateRangePicker

// date picker 옵션 셋팅
const setDatePickerOptions = function(options) {
	//default setting
	options.showDropdowns     	= true;
	options.sCalenderType     	= (typeof options.sCalenderType === "string") ? options.sCalenderType : 'range';
	options.bSingleDatepicker 	= (options.sCalenderType === "single");
	options.bAutoUpdateInput 	= (typeof options.bAutoUpdateInput === "boolean") ? options.bAutoUpdateInput : true;

	options.sStartDateName 		= (typeof options.sStartDateName === "string") ? options.sStartDateName : "startDate";
	options.sEndDateName   		= (typeof options.sEndDateName === "string") ? options.sEndDateName : "endDate";
	options.sStartDateId   		= (typeof options.sStartDateId === "string") ? options.sStartDateId : "start_date";
	options.sEndDateId     		= (typeof options.sEndDateId === "string") ? options.sEndDateId : "end_date";

	options.bPredefinedRange 	= (typeof options.bPredefinedRange === "boolean") ? options.bPredefinedRange : true;
	options.sDateType        	= (typeof options.sDateType === "string") ? options.sDateType : "day";
	options.bTimePickerIncrement= (typeof options.bTimePickerIncrement === "number") ? options.bTimePickerIncrement : 1;
	options.sDateFormat      	= (options.sDateType === "time") ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";

	options.sStartDate 			= (typeof options.sStartDate === "string") ? options.sStartDate : moment().startOf("month").format(options.sDateFormat);
	options.sEndDate   			= (typeof options.sEndDate === "string") ? options.sEndDate : moment().endOf("month").format(options.sDateFormat);
	if (options.sStartDate < options.sMinDate) {
		options.sStartDate = options.sMinDate;
	}
	if (options.sEndDate > options.sMaxDate) {
		options.sEndDate = options.sMaxDate;
	}

	//time 타입에 시/분이 넘어오지 않을 시
	if (options.sDateType == 'time') {
		if (options.sEndDate.length < 16) {
			options.sEndDate += " 00:00";
		}
		if (options.sStartDate.length < 16) {
			options.sStartDate += " 00:00";
		}
	}

	options.bTimePicker       = (options.sDateType === "time");	//시간 사용 여부
	options.bTimePicker24Hour = options.bTimePicker;			//24시간 형식 사용 여부 (time 사용시 default로 true)

	let ranges = {};

	//predefined
	if (options.bPredefinedRange) {
		ranges['오늘']     = [moment(), moment()];
		ranges['어제']     = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
		if (options.sCalenderType === "range") {
			ranges['최근 7일']  = [moment().subtract(6, 'days').format(options.sDateFormat), moment().format(options.sDateFormat)];
			ranges['최근 30일'] = [moment().subtract(29, 'days').format(options.sDateFormat), moment().format(options.sDateFormat)];
			ranges['이번달']    = [moment().startOf('month').format(options.sDateFormat), moment().endOf('month').format(options.sDateFormat)];
			ranges['지난달']    = [moment().subtract(1, 'month').startOf('month').format(options.sDateFormat), moment().subtract(1, 'month').endOf('month').format(options.sDateFormat)];
		} else {
			ranges['7일 전'] = [moment().subtract(6, 'days').format(options.sDateFormat), moment().subtract(6, 'days').format(options.sDateFormat)];
			ranges['한달 전'] = [moment().subtract(29, 'days').format(options.sDateFormat), moment().subtract(29, 'days').format(options.sDateFormat)];
		}
		options.ranges = ranges;
	}

	//locale
	options.locale = {
		"format"           : options.sDateFormat,
		"separator"        : " ~ ",
		"applyLabel"       : '적용',
		"cancelLabel"      : '초기화',
		"fromLabel"        : "From",
		"toLabel"          : "To",
		"customRangeLabel" : '맞춤 날짜',
		"weekLabel"        : '주',
		"daysOfWeek"       : [
			'일',
			'월',
			'화',
			'수',
			'목',
			'금',
			'토'
		],
		"monthNames"       : [
			'1월',
			'2월',
			'3월',
			'4월',
			'5월',
			'6월',
			'7월',
			'8월',
			'9월',
			'10월',
			'11월',
			'12월'
		],
		"firstDay"         : 0
	};

	return options;
} //setDefaultOptions


// date picker 템플릿 셋팅
const setDatePickerTpl = function(oContainer, options) {
	let defTpl = '<input type="hidden"  name="' + options.sStartDateName + '" id="' + options.sStartDateId + '" class="start_datepicker" value="' + options.sStartDate + '" >';
	if (!options.bSingleDatepicker) {
		defTpl += '<input type="hidden"  name="' + options.sEndDateName + '"  id="' + options.sEndDateId + '" class="end_datepicker hasDatepicker" value="' + options.sEndDate + '">';
	}
	$(defTpl).appendTo(oContainer);
} // setDatePickerTpl


/**
 * input 에 yyyy-mm-dd 형태로 만들어줌
 * input onkeyup="this.value = setDateMask(this.value)"
 * @param objValue
 * @returns {*}
 */
const setDateMask = function(objValue) {
	let v = objValue.replace("--", "-");

	if (v.match(/^\d{4}$/) !== null) {
		v = v + '-';
	} else if (v.match(/^\d{4}\-\d{2}$/) !== null) {
		v = v + '-';
	}

	return v;
}


/**
 * 멀티 셀렉 자동 생성
 * sTarget : select 생성 위치의 셀렉터
 * sOption : default, multiple, search *
 */
/*const setSelect = function(sTarget, sOption) {
	let object = $(sTarget);
	if (typeof sOption == null || sOption == "") {
		sOption = "default";
	}

	let oParam = {
		tags              : false,
		placeholder       : object.attr("placeholder"),
		allowClear        : true,
		dropdownAutoWidth : true,
		dropdownParent    : object.parent(),
	}

	switch (sOption) {
		case "multiple" :
			Object.assign(oParam, {
				multiple		  : "multiple",
				closeOnSelect     : false
			});
			break;

		case "search" :
			oParam.matcher = matchCustom
			break;
	}

	$(document).on("click", "li[id$='-all']",function() {
		if ($(this).attr("aria-selected") == "true") {
			$(sTarget+">option").prop("selected", "selected");
			object.trigger("change");
			$(sTarget).trigger("click");
		} else {
			$(sTarget+">option").prop("selected", false);
			object.trigger("change");
			$(sTarget).trigger("click");
		}
		// setSelect(sTarget, "multiple");
	});

	object.select2(oParam);
}*/

const matchCustom = function(params, data) {

	if ($.trim(params.term) === '') {
		return data;
	}

	if (typeof data.text === 'undefined') {
		return null;
	}

	if (data.text.indexOf(params.term) > -1) {
		var modifiedData = $.extend({}, data, true);
		modifiedData.text += ' (matched)';

		return modifiedData;
	}

	return null;
}

// 다중 선택 조건 필터
const setSelectMultiple = function(target, setOptions) {
	const placeHolder = $(target).attr("placeholder");
	const options     = Object.assign({
		placeholder          : placeHolder,
		ellipsis             : true,
		// selectAll            : false,
		minimumCountSelected : 5
	}, setOptions);

	$(target).multipleSelect(options);
}



/**
 * Sweet Alert
 *
 * options.text    				= (string) alert 메시지 (default : "")
 * options.icon					= (string) icon 타입 (info | error | success | question | warning)
 * options.buttonsStyling       = (boolean) default 스타일 사용 여부 (default : true)
 * options.confirmButtonText    = (string) confirm 버튼 문구 (default : "확인")
 * options.showCancelButton     = (boolean) cancel 버튼 노출 여부 (default:false)
 * options.cancelButtonText     = (string) cancel 버튼 문구 (default : "취소")
 * options.confirmButton        = (string) confirm 버튼 클래스 (default : "btn btn-primary")
 * options.cancelButton         = (string) cancel 버튼 클래스 (default: "btn btn-danger")
 */
const setSweetAlertOptions = function(options) {
	if (typeof options == "undefined") {
		options = {}
	}

	options.sText              = (typeof options.sText === "string") ? options.sText : "";
	options.buttonsStyling     = (typeof options.buttonsStyling === "boolean") ? options.buttonsStyling : true;
	options.sConfirmButtonText = (typeof options.sConfirmButtonText === "string") ? options.sConfirmButtonText : "확인";

	options.bShowCancelButton = (typeof options.bShowCancelButton === "boolean") ? options.bShowCancelButton : false;
	options.sCancelButtonText = (typeof options.sCancelButtonText === "string") ? options.sCancelButtonText : "취소";
	options.sConfirmButton    = (typeof options.sConfirmButton === "string") ? options.sConfirmButton : "btn btn-info";
	options.sCancelButton     = (typeof options.sCancelButton === "string") ? options.sCancelButton : "btn btn-warning";

	return options;
}

const setSweetAlert = function(options, callback) {
	Swal.fire({
		allowOutsideClick : false,
		icon              : options.sIcon,
		html              : options.sText,
		buttonsStyling    : options.buttonsStyling,
		confirmButtonText : options.sConfirmButtonText,
		showCancelButton  : options.bShowCancelButton,
		cancelButtonText  : options.sCancelButtonText,
		customClass       : {
			confirmButton : options.sConfirmButton,
			cancelButton  : options.sCancelButton
		}
	}).then(function(result) {
		if (callback) {
			callback(result.isConfirmed);
		}
	});
}

const setSweetAlert2 = async function(options) {
	const result = await Swal.fire({
		allowOutsideClick : false,
		icon              : options.sIcon,
		html			  : options.sText,
		// text              : options.sText,
		buttonsStyling    : options.buttonsStyling,
		confirmButtonText : options.sConfirmButtonText,
		showCancelButton  : options.bShowCancelButton,
		cancelButtonText  : options.sCancelButtonText,
		customClass       : {
			confirmButton : options.sConfirmButton,
			cancelButton  : options.sCancelButton
		}
	});
	return result.isConfirmed;
}

/**
 * Sweet Alarm 타입별 함수 + custom 함수
 */
//callback 방식
const swalInfo = function(sText, callback) {
	let options   = setSweetAlertOptions();
	options.sIcon = "info";
	options.sText = sText;
	options.sConfirmButton = "btn btn-info"

	setSweetAlert(options, callback);
}

const swalError = function(sText, callback) {
	let options   = setSweetAlertOptions();
	options.sIcon = "error";
	options.sText = sText;
	options.sConfirmButton = "btn btn-danger";

	setSweetAlert(options, callback);
}

const swalWarning = function(sText, callback) {
	let options   = setSweetAlertOptions();
	options.sIcon = "warning";
	options.sText = sText;
	options.sConfirmButton = "btn btn-warning";

	setSweetAlert(options, callback);
}

const swalSuccess = function(sText, callback) {
	let options   = setSweetAlertOptions();
	options.sIcon = "success";
	options.sText = sText;
	options.sConfirmButton = "btn btn-success";

	setSweetAlert(options, callback);
}

const swalQuestion = function(sText, callback) {
	let options   = setSweetAlertOptions();
	options.sIcon = "question";
	options.sText = sText;

	setSweetAlert(options, callback);
}

//async await 방식
const swalInfo2 = async function(sText) {
	let options   = setSweetAlertOptions();
	options.sIcon = "info";
	options.sText = sText;
	options.sConfirmButton = "btn btn-info";

	return await setSweetAlert2(options);
}

const swalError2 = async function(sText) {
	let options   = setSweetAlertOptions();
	options.sIcon = "error";
	options.sText = sText;
	options.sConfirmButton = "btn btn-danger";

	return await setSweetAlert2(options);
}

const swalWarning2 = async function(sText) {
	let options   = setSweetAlertOptions();
	options.sIcon = "warning";
	options.sText = sText;
	options.sConfirmButton = "btn btn-warning";

	return await setSweetAlert2(options);
}

const swalSuccess2 = async function(sText) {
	let options   = setSweetAlertOptions();
	options.sIcon = "success";
	options.sText = sText;
	options.sConfirmButton = "btn btn-success";

	return await setSweetAlert2(options);
}

const swalQuestion2 = async function(sText) {
	let options   = setSweetAlertOptions();
	options.sIcon = "question";
	options.sText = sText;
	options.sConfirmButton = "btn btn-question";

	return await setSweetAlert2(options);
}

//컨펌용 swal
const swalConfirm = function(sText, callback) {
	let options               = setSweetAlertOptions();
	options.sIcon             = "question";
	options.sText             = sText;
	options.bShowCancelButton = true;

	setSweetAlert(options, callback)
	return false;
}

//컨펌용 swal 다른 타입
const swalConfirm2 = async function(sText, options) {
	options               	  = setSweetAlertOptions(options);
	options.sIcon             = "question";
	options.sText             = sText;
	options.bShowCancelButton = true;

	return await setSweetAlert2(options);
}

//알럿 타입 넘겨받는 swal
const swalType = function(sText, sType) {
	let options = setSweetAlertOptions();
	options.sText = sText;
	options.sIcon = sType;

	setSweetAlert(options);
}

//커스텀 swal
const swalCustom = function(options) {
	if (typeof options == "undefined") {
		options = {}
	}
	options = setSweetAlertOptions(options);

	setSweetAlert(options);
}

/**
 * Toastr
 *
 * options.sType  			 : (string) 토스터 타입 info/success/fail/warning (default : info)
 * options.sText  			 : (string) 토스터 문구
 * options.sTitle 			 : (string) 토스터 타이틀
 * options.sPositionClass 	 : (string) 토스터 포지션 클래스 (토스터 위치 지정) toast- + top/bottom/center + center
 * options.sTitle 			 : (string) 토스터 타이틀
 * options.bPreventDuplicate : (boolean) 토스터 중복 노출 방지 여부 (default : true)
 * options.bNewestOnTop		 : (boolean) 상단 추가 여부 (default : true)
 * options.nTimeOut			 : (integer) timeout (단위 : ms / default : 3000)
 */
const setToastrOptions = function(options) {
	if (typeof options == "undefined") {options = {}}
	options.sType             = (typeof options.sType === "string") ? options.sType : "info";
	options.sText             = (typeof options.sText === "string") ? options.sText : "";
	options.sTitle            = (typeof options.sTitle === "string") ? options.sTitle : "";
	options.sPositionClass    = (typeof options.sPositionClass === "string") ? options.sPositionClass : "toast-top-center";
	options.bPreventDuplicate = (typeof options.bPreventDuplicate === "boolean") ? options.bPreventDuplicate : true;
	options.bNewestOnTop      = (typeof options.bNewestOnTop === "boolean") ? options.bNewestOnTop : true;
	options.nShowDuration     = (typeof options.nShowDuration === "number") ? options.nShowDuration : 300;
	options.nHideDuration      = (typeof options.nHideDuration === "number") ? options.nHideDuration : 300;
	options.nTimeOut          = (typeof options.nTimeOut === "number") ? options.nTimeOut : 2000;
	options.nExtendedTimeOut  = (typeof options.nExtendedTimeOut === "number") ? options.nExtendedTimeOut : 2000;
	options.showEasing        = (typeof options.showEasing === "string") ? options.showEasing : "swing";
	options.sHideEasing       = (typeof options.sHideEasing === "string") ? options.sHideEasing : "linear";
	options.showMethod        = (typeof options.showMethod === "string") ? options.showMethod : "fadeIn";
	options.sHideMethod       = (typeof options.sHideMethod === "string") ? options.sHideMethod : "fadeOut";
	return options;
}

const setToastr = function(options) {
	toastr.options = {
		"closeButton"       : false,
		"debug"             : false,
		"onclick"           : null,
		"progressBar"       : false,
		"newestOnTop"       : options.bNewestOnTop,
		"positionClass"     : options.sPositionClass,
		"preventDuplicates" : options.bPreventDuplicate,
		"showDuration"      : options.nShowDuration,
		"hideDuration"      : options.nHideDuration,
		"timeOut"           : options.nTimeOut,
		"extendedTimeOut"   : options.nExtendedTimeOut,
		"showEasing"        : options.showEasing,
		"hideEasing"        : options.sHideEasing,
		"showMethod"        : options.showMethod,
		"hideMethod"        : options.sHideMethod
	}

	switch (options.sType) {
		case "success" :
			toastr.success(options.sText, options.sTitle);
			break;

		case "info" :
			toastr.info(options.sText, options.sTitle);
			break;

		case "fail" :
			toastr.error(options.sText, options.sTitle);
			break;

		case "warning" :
			toastr.warning(options.sText, options.sTitle);
			break;
	}

}

/**
 * Toastr 타입별 함수 + custom 함수
 */
const toastrInfo = function(sText) {
	let options = setToastrOptions();
	options.sType = "info"
	options.sText = sText;

	setToastr(options);
}

const toastrSuccess = function(sText) {
	let options = setToastrOptions();
	options.sType = "success"
	options.sText = sText;

	setToastr(options);
}

const toastrFail = function(sText) {
	let options = setToastrOptions();
	options.sType = "fail"
	options.sText = sText;

	setToastr(options);
}

const toastrWarning = function(sText) {
	let options = setToastrOptions();
	options.sType = "warning"
	options.sText = sText;

	setToastr(options);
}

const toastrType = function(sText, sType) {
	let options = setToastrOptions();
	options.sType = sType;
	options.sText = sText;

	setToastr(options);
}

const toastrCustom = function(options) {
	options = setToastrOptions(options);
	setToastr(options);
}

const toastrCenterInfo = function(sText) {
	let options = setToastrOptions();
	options.sType = "info"
	options.sText = sText;
	options.sPositionClass = "toast-center-center";

	setToastr(options);
}

const toastrCenterSuccess = function(sText) {
	let options = setToastrOptions();
	options.sType = "success"
	options.sText = sText;
	options.sPositionClass = "toast-center-center";

	setToastr(options);
}

const toastrCenterFail = function(sText) {
	let options = setToastrOptions();
	options.sType = "fail"
	options.sText = sText;
	options.sPositionClass = "toast-center-center";

	setToastr(options);
}

const toastrCenterWarning = function(sText) {
	let options = setToastrOptions();
	options.sType = "warning"
	options.sText = sText;
	options.sPositionClass = "toast-center-center";

	setToastr(options);
}

const toastrCenterType = function(sText, sType) {
	let options = setToastrOptions();
	options.sType = sType;
	options.sText = sText;
	options.sPositionClass = "toast-center-center";

	setToastr(options);
}

/**
 * cleave.js  -  https://github.com/nosir/cleave.js/blob/master/doc/options.md
 *
 * input mask 씌우기
 *
 * options.numeral			: (boolean)  숫자만 (with 콤마)
 * options.swapHiddenInput 	: (boolean) mask가 씌워져 보이긴 하되, 실제 value는 입력한 그대로 들어가게 하는 옵션
 *
 * options.delimiters 	: [] blocks 옵션에 정의된 구분자들이 들어갈 index 번호
 * options.blocks		: [] delimiters 옵션과 사용 시 - 구분자 들어갈 위치  || Only 옵션들과 사용 시 글자 수 제한 (필수옵션)
 * options.uppercase 	: (boolean) 대문자로 변환되어 입력 [default : false]
 * options.lowercase 	: (boolean) 소문자로 변환되어 입력 [default : false]
 * options.numericOnly 	: (boolean) 숫자만 [default : false]
 * options.englishOnly 	: (boolean) 영문자만  [default : false]
 *
 */
$.fn.setInputMask = function(options) {

	new Cleave(this, options);

}




//Modal Start ***************************************************************************************
const _Modal = {
	/**
	 *
	 * @param obj
	 *
	 * param description
	 *
	 * **) url : ajax 로 가져올 html 페이지
	 * **) id : 모달을 감싸는 최상위 div의 id (지정을 안하면 자동 발급)
	 * **) title : 모달의 제목(header 영역)
	 * **) sizeClass : 모달 width 사이즈
	 * 		ex) sizeClass: 'mw-850px',  //max-width:850px
	 * 		 	sizeClass: 'modal-xl', //1140px
	 * 		 	sizeClass: 'modal-lg', //800px
	 * 		 	sizeClass: 'modal-sm', //300px;
     * 		 	sizeClass: 'modal-fullscreen', //전체
	 * 		 mw-700px 같이 수동으로 조정도 되고, 정해진 class 명을 써도 된다.
	 * **) isFooter: footer 하단 영역 여부 - 기본은 '확인'(닫힘) 버튼
	 * **) footerHtml: isFooter가 true일 경우에 footer영역을 수동으로 그리는 param
	 * 		ex) 		let html='';
	 * 					html += '            <div class="modal-footer">';
	 * 					html += '                <!--begin::Button-->';
	 * 					html += '            	<div class="btn btn-light me-3"  data-bs-dismiss="modal">닫기</div>';
	 * 					html += '                <!--end::Button-->';
	 * 					html += '                <!--begin::Button-->';
	 * 					html += '            	<a href="#" class="btn btn-primary">';
	 * 					html += '            		<span class="indicator-label">Submit</span>';
	 * 					html += '            		<span class="indicator-progress">Please wait...';
	 * 					html += '            											<span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>';
	 * 					html += '            	</a>';
	 * 					html += '                <!--end::Button-->';
	 * 					html += '            </div>';
	 * 				isFooter: html
	 * **) isBackdrop: 모달 바깥을 마우스 클릭했을 시, 모달이 자동으로 닫힐지 말지 (true : 안닫힘, false: 닫힘)
	 * **) isCenter: 모달의 vertical 영역이 가운데로 할지 말지
	 * ------------------------------------------------------------------------------------
	 * default param
	 * obj.url = 필수 입력
	 * obj.id = modal_id_{index}
	 * obj.title = ''
	 * obj.sizeClass = mw-650px
	 * obj.isFooter = true
	 * obj.footerHtml = ''
	 * obj.isBackdrop = true
	 * obj.isCenter = false
	 * ------------------------------------------------------------------------------------
	 * ex)
	 * $(document).on('click', 'selector', function() {
	 * 		const obj = {
	 * 			title:'test',
	 * 			sizeClass: 'modal-xl', //1140px
	 * 			// sizeClass: 'modal-lg', //800px
	 * 			// sizeClass: 'modal-sm', //300px;
	 * 			// sizeClass: 'modal-fullscreen', //전체
	 *          //footerHtml: '',
	 * 			isBackdrop: false,
	 * 			isCenter: false,
	 * 			url: '/test/jang/nolayout/modal'
	 * 		}
	 * 		_Modal.init(obj);
	 * 		return false;
	 * });
	 * ------------------------------------------------------------------------------------
	 * 참고 사항
	 * url 보낼때, 해당 url에 parameter로 modal의 최상위 div id와 modal의 고유 index 값을 같이 보낸다. 사용할 일이 생길까봐..
	 *   ex) url = '/test/page1' -> 'test/page1?modalId=modal_id_2&modalIndex=2'
	 */
	init: function(obj) {
		const el = typeof obj !== 'undefined'? obj : {};
		const htmlInfo = this.getHtml(el);
		if(!htmlInfo.result){
			alert(htmlInfo.msg);
			return false;
		}
		//body 아래에 append
		$('body').append(htmlInfo.html)

		const modalIndex = htmlInfo.modalIndex;
		const bodyTarget = $("#modal_body_"+modalIndex);

		let url = obj.url;

		if(url.indexOf("?") > -1) {
			url += "&";
		} else {
			url += "?";
		}

		url += "modalId="+htmlInfo.id+"&modalIndex="+htmlInfo.modalIndex;

		//모달 열릴떄 처리
		$(document).on("show.bs.modal", "#"+htmlInfo.id, function() {
			var zIndex = 1050 + (10 * htmlInfo.modalIndex-1);

			$(this).css('z-index', zIndex);

			setTimeout(function() {

				$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');

			}, 0);

		});

		//모달 닫은 후 삭제 처리
		$(document).on("hidden.bs.modal", "#"+htmlInfo.id, function() {
			$("#"+htmlInfo.id).remove();
			// multiple modal Scrollbar fix
			$('.modal:visible').length && $(document.body).addClass('modal-open');
		});

		$.ajax({
			url : url,
			type : 'GET',
			cache : false,
			async : false, //순차적으로 실행이 완료 되고 나서, 다음 실행을 하도록 하기 위해
			beforeSend: function() {
				bodyTarget.setBlockUI();
				$("#"+htmlInfo.id).modal('show');
			}
		}).done(function(res) {
			$(bodyTarget).html(res);
		}).fail(function(){
			alert('정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해 주세요');
			$("#"+htmlInfo.id).modal('hide');
			bodyTarget.setUnBlockUI();
		});

		return false;
	},

	getHtml: function(obj) {
		const modalIndex = this.getModalIndex();

		const id = typeof obj.id !== 'undefined'? obj.id : 'modal_id_'+modalIndex;
		const title = typeof obj.title !== 'undefined'? obj.title : '';
		const sizeClass = typeof obj.sizeClass !== 'undefined'? obj.sizeClass : '';
		const isFooter = typeof obj.isFooter !== 'undefined'? obj.isFooter : true;
		const footerHtml = typeof obj.footerHtml !== 'undefined'? obj.footerHtml : '';
		const isBackdrop = typeof obj.isBackdrop !== 'undefined'? obj.isBackdrop : true;
		const isCenter = typeof obj.isCenter !== 'undefined'? obj.isCenter : false;


		if($('#'+id).length > 0) {
			/*const result = {
				result: false,
				msg: 'Modal Id가 중복되었습니다.'
			}
			return result;*/

			//다시 열수 있도록 하기 위해
			$('#'+id).remove();
		}

		let html = '	<div class="modal fade" id="'+id+'" tabIndex="-1" role="dialog" '+(title!=''? 'aria-labelledby="'+title+'"' : '')+' aria-hidden="true" ' +(isBackdrop ? 'data-bs-backdrop="static"' : '') + ' modalindex="'+modalIndex+'">';
		html    += '   		<div class="modal-dialog '+ (isCenter ? 'modal-dialog-centered' : '') +' modal-dialog-scrollable '+sizeClass+'">';
		html    += '			<div class="modal-content">';
		html    += '				<div class="modal-header border-bottom">';
		html    += '					<h5 class="modal-title" id="exampleModalScrollableTitle">'+title+'</h5>';
		html    += '					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>';
		html    += '				</div>';
		html    += '   	    		<div class="modal-body" id="modal_body_'+modalIndex+'">';
		html    += '                	<div class="d-flex m-2">';
		html    += '                	</div>';
		html    += '   	    		</div>';

		if(isFooter) {
			if(footerHtml  == '') {
				html += '            <div class="modal-footer border-top">';
				html += '                <!--begin::Button-->';
				html += '            	<div class="btn btn-primary" data-bs-dismiss="modal">확인</div>';
				html += '                <!--end::Button-->';
				html += '            </div>';

			}else{
				html += footerHtml;
			}
		}
		html    += '   	    </div>';
		html    += '   </div>';
		html    += '</div>';

		const result = {
			result: true,
			html: html,
			modalIndex: modalIndex,
			id: id,
			isFooter: isFooter
		}
		return result;
	},

	getModalIndex: function() {
		const modals = $('.modal');
		let modalIndex = 0;
		if(typeof modals !=='undefined'){
			for(let i=0;i<modals.length;i++){
				const idx = $(modals[i]).attr("modalindex");
				if(typeof idx !=='undefined') {
					if(modalIndex < Number(idx)) {
						modalIndex = Number(idx);
					}
				}
			}
		}

		modalIndex = modalIndex+1;
		return modalIndex;
	}
}
//Modal End ***************************************************************************************

$.fn.setBlockUI = function() {
	if($(this)) {
		$(this).block({
			message: '<div class="spinner-border text-primary" role="status"></div>',
			css: {
				backgroundColor: "transparent",
				border: "0"
			},
			overlayCSS: {
				//backgroundColor: "#fff",
				backgroundColor: "#e9ebec",
				opacity: 0.8
			}
		})
	}
}

$.fn.setUnBlockUI = function() {
	if($(this)) {
		$(this).unblock();
	}
}

setSelect2 = function() {
	const selects = $("select");
	$(selects).each(function(obj) {
		if($(this).is("[nas-select2]")){

			//nas-select-all attritution 이 있으면 전체선택 추가
			if($(this).is("[nas-select2-all]")){
				const options = $(this).find("option");
				// 이미 all 이 있는지 체크 후 없으면 추가
				let isAll = false;
				$(options).each(function(idx, op) {
					if(op.value == "all") {
						isAll = true;
					}
				});
				if(!isAll) {
					$(this).prepend("<option value=\"all\">==전체 선택==</option>")
				}
			}

			let oParam = {
				tags              : false,
				allowClear        : true,
				dropdownAutoWidth : true,
				dropdownParent    : $(this).parent(),
			}

			$(this).select2(oParam);
		}
	});

	$("select[nas-select2]").on("select2:select", function (e) {
		const data = e.params.data.id;
		const allSize = $(this).find("option").length;
		if(data=='all'){
			const selectedLength = $(this).select2("data").length; // 선택된 애들 길이 -> all 포함
			if(selectedLength == allSize) {
				$(this).find("option").prop("selected", false);
			}else {
				$(this).find("option").prop("selected", true);
				$(this).find("option[value=all]").prop('selected', false); //all만 select 제거
			}
			$(this).trigger("change");

		}
	});
}


//로딩시 실행할 함수들
$(function() {
	setSelect2();
});