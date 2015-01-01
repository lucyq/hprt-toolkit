var ASK = "ASK the question! Open conversation with questions such as: \"Many of my patients feel that their experiences of mass violence or trauma have had a major impact on their health and well-being. Has this been the case for you?\" Listen to the answer and acknowledge the patients trauma story. This simple act is usually healing in itself. Use words like \"I see,\" or \"I can understand how that would upset you.";

var IDENTIFY = 'IDENTIFY any concrete physical or mental effects that are due to the results or continued threat of violence or torture. For example, is the patient complaining of headaches, stomach upset, back pain, or sleep disturbances? Does the patient exhibit feelings of anxiety and depression? Have medical or psychiatric disorders worsened?';

var DIAGNOSE = 'Most patients will not suffer from serious mental illness. The majority of patients will benefit from your attention to their grief, generalized anxiety, depression, PTSD, and insomnia. Use HPRT\'s Simple Screen to decide (see HPRT\'s website at www.hprt-cambridge.org).';

var REFER = 'REFER screened cases of serious mental illness (i.e., danger to self and others, complicated grief, severe forms of PTSD and/or depression, physical and social disability) to a mental health practitioner.';

var REINFORCE = 'REINFORCE & TEACH positive behaviors and coping techniques during the patient visit. Remind the patient to build physical, spiritual, and mental strength. Use phrases such as: "I want you to keep up the good work - it\'s good for you and will help you cope." Encourage exercise, relaxation, and anti-anxiety techniques.';

var RECOMMEND = 'RECOMMEND altruism, work, and spiritual activities. Use phrases such as: "I strongly recommend that you work and keep busy, try to help others, and consult with your clergy or engage in spiritual activities such as meditation or prayer."';

var REDUCE = 'REDUCE high-risk behaviors like smoking, drinking, drug use, and unprotected sex. Ask questions such as: "Have you started to use or increased your use of cigarettes, drugs, or alcohol? Are you having unprotected sex?"';

var CULTURE = 'BE CULTURALLY ATTUNED to differences in meaning and interpretations of emotional upset between cultures. Different cultures have different conceptions of the causes of illnesses. Pay close attention to dosage strengths and side effects as they relate to ethnically influenced factors such as tolerance levels and body weight. Be aware of a patient’s pre-existing “sustained threshold” for trauma or difficult circumstances (i.e., previous trauma, domestic or economic hardship, domestic or community violence). Some patients may have a narrower capacity for addi- tional trauma or anxiety in their lives.';

var PRESCRIBE = 'PRESCRIBE psychotropic drugs if necessary. Psychotropic medication prescriptions should be tailored to the racial and ethnic background of the patient, since there are well-documented differences in drug metabolism and response to treatment according to race/ethnicity. For simple and detailed guides about the drugs most commonly used to treat grief reactions, generalized anxiety, depression, PTSD, and insomnia, see HPRT’s psychopharmacology pamphlet.';
	
var SCHEDULE = 'CLOSE & SCHEDULE follow-up visits. Add the physical and emotional symptoms to the problem list. Use phrases such as: "Thank you for telling me about these upsetting events. You have helped me to understand your situation better." Then ask the patient: "How would you like me to help you?" Make a plan with the patient that includes follow-up visits. Just having an additional conversation with the patient at a later date can be very beneficial in strengthening their mental health.';

var PREVENT = 'PREVENT BURNOUT by discussing with your colleagues. Dealing with these issues can be stressful for doctors. We recommend that you regularly discuss these cases and your reactions with at least one colleague to prevent burnout.';

var NUM_POINTS = 11;

var clickCount = [];

for (var i = 0; i < NUM_POINTS; i++) {
	clickCount[i] = 0;
}

var point_ids = [];
for (var i = 0; i < NUM_POINTS; i++) {
	point_ids[i] = i + "_text";
}

var point_text = [ASK, IDENTIFY, DIAGNOSE, REFER, REINFORCE, RECOMMEND, REDUCE, CULTURE, PRESCRIBE, SCHEDULE, PREVENT];

function displayInfo(num_point) {

	if (clickCount[num_point] % 2 == 0) {
		var para = document.createElement("p");
		para.id = point_ids[num_point];
		var text = document.createTextNode(point_text[num_point]);
		para.appendChild(text);

		var elem = document.getElementById(num_point);
		elem.appendChild(para);
	} else {
		var elem = document.getElementById(point_ids[num_point]);
 		elem.parentNode.removeChild(elem);
	}
		clickCount[num_point]++;

}



