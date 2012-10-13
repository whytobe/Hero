
function addOption(selectId, txt, val,ckable) {
    var objOption = new Option(txt,val);
    if (ckable == 0 ) {
        document.getElementById(selectId).options.add(objOption);
    }else {
        document.getElementById(selectId).options.add(objOption);
        document.getElementById(selectId).selectedIndex =ckable;
    }
}
// ###@@@
function OverCreditLimit(credit) {
	alert('จำนวนหน่วยกิตเกิน ( ' + credit + ' นก.)ไม่สามารถเพิ่มรายวิชานี้ได้');
}
// @@@###

function AddSubject() {
	if(document.getElementById('txt_subj_id').value != '' && document.getElementById('txt_section').value != '' && document.getElementById('txt_subj_gp_id').value != '') {	
		//alert("ใกล้จะเพิ่มได้ละ");
		xajax_AddSubjectCheck_0(document.getElementById('hd_year_study').value, document.getElementById('hd_term_study').value, document.getElementById('hd_std_id').value, document.getElementById('txt_subj_id').value, document.getElementById('txt_section').value, document.getElementById('hd_std_type_id').value, document.getElementById('txt_subj_gp_id').value, document.getElementById('txt_credit').value);
	}else {
		alert("กรุณาใส่รหัสวิชา, section !");
	}
}

function SubjGroupPR000Block() {
	alert('นักศึกษาอยู่ระหว่างฝึกประสบการณ์ ถ้าต้องการเพิ่มวิชาเรียน ให้ติดต่อเพิ่มได้ที่ส่งเสริมวิชาการฯ ตามวันเวลาที่กำหนด !!');
}

function DontSelectSubjectNewOpen() {
	alert('วิชานี้เป็นวิชาเปิดใหม่ ให้นักศึกษาเพิ่มวิชาได้กับทางเจ้าหน้าที่เท่านั้น !!');
}

// Block Move Section 
function BlockMoveSectionAddSubject(subj_id, section) {
	alert('นักศึกษามีแผนการเรียนวิชา : ' + subj_id + ', sect : ' + section + ' ไม่สามารถย้ายไปเรียน section อื่นได้ !!');
}

// Over Max Amount
function OverMaxAmountLimitBySect(max_amount, amount) {
	alert('จำนวนนักศึกษาใน Section นี้เต็มแล้ว กรุณาเปลี่ยนเป็น Section อื่น !!');
}

function OverMaxAmountLimitAllSect(max_amount, amount) {
	alert('จำนวนนักศึกษาเิกินแล้ว (' + amount + '/' + max_amount +') !!');
}

function ConfirmDelRegCourse(year_study, term_study, std_id, subj_id) {
	if(confirm('ยืนยันการลบข้อมูลหรือไม ?่')) {
		xajax_DelRegCourse(year_study, term_study, std_id, subj_id);
	}else {
		return false;
	}
}

function doSearchSubject() {	
	var year_study = document.getElementById('hd_year_study').value;
	var term_study = document.getElementById('hd_term_study').value;
	var subj_id = document.getElementById('txt_subj_id').value;
	var std_type_id = document.getElementById('hd_std_type_id').value;
	
	if(subj_id != "") {
		var url = "redirect.php?mode=regcourse&fpath=subject_tablecourse_lookup_subj_id.php&std_type_id=" + std_type_id +"&year_study=" + year_study + "&term_study=" + term_study + "&flgField=s.subj_id&flgCriteria=" + subj_id;
	}else {
		var url = "redirect.php?mode=regcourse&fpath=subject_tablecourse_lookup.php&std_type_id=" + std_type_id +"&year_study=" + year_study + "&term_study=" + term_study + "&flgField=s.subj_id&flgCriteria=";
	}
	window.open(url, 'SubjectLookup', 'width=1024,height=600,resizable=yes,toolbar=no,scrollbars=yes');
}

function doRefreshSubject(recieved_value1, recieved_value2, recieved_value3) {
	document.getElementById('txt_subj_id').value = recieved_value1;
	document.getElementById('txt_section').value = recieved_value2;
	document.getElementById('txt_subj_gp_id').value = recieved_value3;
	xajax_AjaxGetNameFromID('subject', 'subj_id', 'subj_name_th', recieved_value1, recieved_value1.length, 'txt_subj_id', 'txt_subj_id_display', 'txt_section', 'รหัสวิชาไม่ถูกต้อง');
	
	//xajax_AjaxGetSubjectGroupForStudent(document.getElementById('txt_subj_id').value, );	
	xajax_AjaxGetSubjectGroupForStudent(document.getElementById('hd_std_type_id').value, document.getElementById('hd_year_study').value, document.getElementById('hd_term_study').value, document.getElementById('txt_subj_id').value, document.getElementById('hd_std_id').value, document.getElementById('txt_section').value);	
}

function GetSubjectName() {
	if(document.getElementById('txt_subj_id').value != '') {
		xajax_AjaxGetNameFromID('subject', 'subj_id', 'subj_name_th', document.getElementById('txt_subj_id').value, document.getElementById('txt_subj_id').value.length, 'txt_subj_id', 'txt_subj_id_display', 'txt_section', 'รหัสวิชาไม่ถูกต้อง');
	}else {
		alert("กรุณาใส่รหัสวิชาก่อน !");
		document.getElementById('txt_section').value = "";
		document.getElementById('txt_subj_id').focus();
	}
}

function GetSubjectGroupForStudent(section) {
	if(section.length == 2) {
		if(document.getElementById('txt_subj_id').value != '' && document.getElementById('txt_section').value != '') {
			xajax_AjaxGetSubjectGroupForStudent(document.getElementById('hd_std_type_id').value, document.getElementById('hd_year_study').value, document.getElementById('hd_term_study').value, document.getElementById('txt_subj_id').value, document.getElementById('hd_std_id').value, document.getElementById('txt_section').value);	
		}else {
			alert("กรุณาใส่รหัสวิชา และ section ก่อน !");
		}
	}
}

function openSubjPrerequisiteBox(year_study, term_study, std_id, subj_id, section, std_type_id, subj_gp_id, credit) {
	var url = "redirect.php?mode=lookup&fpath=subj_prerequisite_lookup.php&year_study=" + year_study + "&term_study=" + term_study + 
		"&std_id=" + std_id + "&subj_id=" + subj_id + "&section=" + section + "&std_type_id=" + std_type_id + 
		"&subj_gp_id=" + subj_gp_id + "&credit=" + credit;
		
	window.open(url, 'SubjectPrerequisiteLookup', 'width=800,height=300,resizable=yes,toolbar=no,scrollbars=yes');		
}

function doRefreshSubjPrerequisite(year_study, term_study, std_id, subj_id, section, std_type_id, subj_gp_id, credit) {
	//alert(year_study+ ' - ' +term_study+ ' - ' +std_id+ ' - ' +subj_id+ ' - ' +section+ ' - ' +std_type_id+ ' - ' +subj_gp_id+ ' - ' +credit);
	xajax_AddSubjectReal(year_study, term_study, std_id, subj_id, section, std_type_id, subj_gp_id, credit);
}

function makeUppercase() {
	document.getElementById('txt_section').value = document.getElementById('txt_section').value.toUpperCase();
}

function makeUppercaseSubjID() {
	document.getElementById('txt_subj_id').value = document.getElementById('txt_subj_id').value.toUpperCase();
}

function SubjPrerequisiteMsgBox(subj_id) {
	alert('วิชานี้เป็นวิชาที่ต้องเรียนวิชา ' + subj_id + ' มาก่อน !!');
}
