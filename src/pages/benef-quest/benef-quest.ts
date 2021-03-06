import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalService } from '../../services/local.service';
import { iQuestForm } from '../../interfaces/questform.interface';
import { CrudService } from '../../services/crud.service';

@IonicPage()
@Component({
  selector: 'page-benef-quest',
  templateUrl: 'benef-quest.html',
})
export class BenefQuestPage {
  VALUES = ['1', '2', '3', '4', '5'];
  QUESTIONS = [
    'How easily did you access service?',
    'How fast did you get feedback?',
    'How fast did you get support?'
  ]

  QUESTIONSX = {
    INFO: {
      COUNTRY: 'Country',
      CENTERNAME: 'Name of Center',
      FILENUMBER: 'File nr',
      GENDER: 'Gender',
      EVAL_PLACE: 'Place of evaluation',
      EVAL_PLACE_OPTIONS: ['Center','Field','Home'],
      NAME_BENEFICIARY: 'Name of beneficiary',
      OCCUPATION: 'Current Occupaction',
      LIVING_ENV: 'Living environment',
      EVAL_DATE: 'Date of evaluation (DD/MM/YYYY)',
      YoB: 'Year of birth',
      YoAmDis: 'Year of amputation/disability',
      CauseOfAmDis: 'Cause of amputation/disability'
    },
    DEVICE: {
      Q1: 'User device?',
      Q1OPTIONS: ['Prosthetic-single','Prosthetic-multi','Orthotic-single','Orthotic-mult','Both P&O'],
      Q2: 'Type of Prosthesis',
      Q2OPTIONS: ['LEFT-PF','LEFT-TT','LEFT-KD','LEFT-TF','LEFT-HD','LEFT-TR','LEFT-TH','LEFT-NA','RIGHT-PF','RIGHT-TT','RIGHT-KD','RIGHT-TF','RIGHT-HD','RIGHT-TR','RIGHT-TH','RIGHT-NA'],
      Q2A: 'First device delivery date (DD/MM/YYYY)',
      Q2B: 'Last device delivery date (DD/MM/YYYY)',
      Q2C: 'Number of device(s) received to date from this center',
      Q3: 'Type of Orthosis',
      Q3OPTIONS: ['LEFT-AFO','LEFT-KO','LEFT-KAFO','LEFT-HKAFO','LEFT-NA','RIGHT-AFO','RIGHT-KO','RIGHT-KAFO','RIGHT-HKAFO','RIGHT-NA'],
      Q3A: 'First device delivery date (DD/MM/YYYY)',
      Q3B: 'Last device delivery date (DD/MM/YYYY)',
      Q3C: 'Number of device(s) received to date from this center',
      Q4: 'Is any spare usable device available?',
      Q4OPTIONS: ['Yes', 'No']
    },
    ACCESSSABILITY: {
      Q5: 'Why did you come to this center?',
      Q5OPTIONS: ['No other center', 'Quality related', 'Price related', 'Referred'],
      Q6: 'Did you pay for the device?',
      Q6OPTIONS: ['Yes','No'],
      Q6A: 'How much (USD)?',
      Q7: 'Waiting time from registration till 1st appoinment?',
      Q7OPTIONS:['1','2','3','4','5','6','7','8','9','10','>10',],
      Q8: 'Travel time from home to Center?',
      Q8OPTIONS:['1','2','3','4','5','6','7','8','9','10','>10',],
      Q9: 'Did you overnight at the center during the treatment period?',
      Q9OPTIONS: ['Yes','No, I did not need it', 'No, because no room available'],
      Q10: 'Is it important that dormitories are available?',
      Q10OPTIONS: ['0','1','2','3','4'],
      Q11: 'Do you get an appoinment for follow-up?',
      Q11OPTIONS: ['Yes', 'No', 'Do not remember'],
      Q12: 'What are your main concerns whether you need to come back for services back-up?',
      Q12OPTIONS: ['Costs of services', 'Distance/cost to travel', 'Staff lack of friendliness', 'Food/accommodation cost','Waiting time','Missing school','Loss of income', 'Low quality of services', 'Security/Safety','NA']
    },
    QUALITY: {
      Q13: 'Were staffs friendly and keen to inform and help you whenever required?',
      Q13OPTIONS: ['Yes','More or less','No'],
      Q14: 'Were you well-informed about all treatment steps and functioning of the centre?',
      Q14OPTIONS: ['Yes','More or less','No'],
      Q15: 'Did a Doctor and/or medical team see you before starting our device(s)?',
      Q15OPTIONS: ['Yes','No','Not sure/ Do not remember'],
      Q16: 'Did you undergo any kind of treatment/exercises before starting your device(s)?',
      Q16OPTIONS: ['Yes','No','Not sure/ Do not remember'],
      Q17: 'Is the device confortable?',
      Q17OPTIONS: ['0','1','2','3','4','5'],
      Q18: 'Is the device meeting your expectation?',
      Q18OPTIONS: ['0','1','2','3','4','5'],
      Q19: 'How many hours do you use the device and spare device everyday? (From 0 to 10 hours or more per day)',
      Q19OPTIONS:['1','2','3','4','5','6','7','8','9','10','>10',],
      Q20: 'How would you rate your amputation capacity without Device?',
      Q20OPTIONS: ['0','1','2','3','4','5'],
      Q20A: 'How would you rate your amputation capacity with Device?',
      Q20AOPTIONS: ['0','1','2','3','4','5']
    },
    IMPACT: {
      Q21: 'Are you working for your own living or for your households living?',
      Q21OPTIONS: ["Not working, at other's charge",'Not working but receive an allowance','Working for own living', "Working and contributing to the household's living","Working and providing for all household's costs"],
      Q22: 'How important is the device to earn a living?',
      Q22OPTIONS: ['0','1','2','3','4'],
      Q23: 'Before getting your first device, could you perform any regular work/activity?',
      Q23OPTIONS: ['Yes', 'No'],
      Q23A: 'Please specify',
      Q24: 'Nowadays, could you perform your current daily activities without device?',
      Q24OPTIONS: ['Yes','More or less','No'],
      Q25: 'If NO, could you perform activities with other mobility-aid device: crutch, wheelchair...',
      Q25OPTIONS: ['Yes','More or less','No'],
      Q26: 'Were there any changes in your income after getting your first device?',
      Q26OPTIONS: ['It reduced', 'Slight improvements','No changes', 'Substantial improvements', 'NA' ],
      Q27: 'How important is your device for interacting within your community?',
      Q27OPTIONS: ['0','1','2','3','4'],
      Q28: 'How do you feel uncomfortable being seen as a person with a physical disability?',
      Q28OPTIONS: ['0','1','2','3','4'],
      Q29: 'Does the device help you feel better?',
      Q29OPTIONS: ['Yes','More or less','No']
    },
    ENDING: {
      COMMENT: 'Comment',
      INTERPRETER_NAME: '',
      INTERPRETER_W4C: false,
      EVALUATOR_NAME: '',
      EVALUATOR_W4C: false,
    }
  }

  ANSWERS: [
    { TXT: 'No money', value: '1' },
    { TXT: 'Far from home', value: '2' }
  ]
  FEEDBACKS = {
    FB0: '',
    FB1: '',
    FB2: ''
  }
  ANSWER: iQuestForm;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private localService: LocalService,
    private crudService: CrudService
    ) {

      this.ANSWER = this.localService.QUESTION_FORM_DEFAULT;
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServiceFeedbackPage');
  }

  addFeedback() {
    console.log(this.ANSWER);
    this.crudService.feedbackNewAdd(this.ANSWER)
    .then((res)=>{
      console.log(res);
    })
    .catch(err=> console.log(err))
  }

}
