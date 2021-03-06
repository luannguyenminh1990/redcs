import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { iPatient } from '../../interfaces/patient.interface';
import { CrudService } from '../../services/crud.service';
import { AppService } from '../../services/app.service';
import { iLoc } from '../../interfaces/loc.interface';
import { LocalService } from '../../services/local.service';
import { iUsr } from '../../interfaces/usr.interface';

@IonicPage()
@Component({
  selector: 'page-case-information-fill',
  templateUrl: 'case-information-fill.html',
})
export class CaseInformationFillPage {
  data;
  PATIENT: iPatient;
  USER: iUsr;
  ACTION: string = 'add-new';
  LOCATIONS: iLoc[] = [];
  CITIES: iLoc[];
  DIST_IN_CITY: iLoc[] = [];
  WARDS_IN_DIST: iLoc[] = [];
  DISABLED_SPONSORS: string[] = [];
  DISABLED_PARTS: string[] = [];
  DISABLED_REASONS: string[] = [];
  AMPUTATION_SPONSORS: string[] = [];
  AMPUTATION_PARTS: string[] = [];
  AMPUTATION_REASONS: string[] = [];
  JOBS: string[] = [];
  SELECTED_DISTRICTS: iLoc[];
  SELECTED_WARDS: iLoc[];
  toggleValue: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private crudService: CrudService,
    private appService: AppService,
    private localService: LocalService
  ) {
    this.data = this.navParams.data;
    console.log(this.data);
    this.PATIENT = this.data.PATIENT;
    this.USER = this.data.USER;
    // this.ACTION = this.data.ACTION;
    let basicinfos = this.localService.BASIC_INFOS;
    // console.log(res.data());
    if (basicinfos) {
      this.CITIES = basicinfos.CITIES;
      this.DISABLED_PARTS = basicinfos.DISABLED_PARTS;
      this.DISABLED_REASONS = basicinfos.DISABLED_REASONS;
      this.DISABLED_SPONSORS = basicinfos.DISABLED_SPONSORS;
      this.AMPUTATION_PARTS = basicinfos.AMPUTATION_PARTS;
      this.AMPUTATION_REASONS = basicinfos.AMPUTATION_REASONS;
      this.AMPUTATION_SPONSORS = basicinfos.AMPUTATION_SPONSORS;
      this.JOBS = basicinfos.JOBS;
    }
    console.log(this.CITIES);
    if (typeof (this.PATIENT) == 'undefined' || typeof (this.USER) == 'undefined') {
      this.navCtrl.setRoot('HomePage');
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CaseInformationFillPage');
    this.getData();
  }

  addPatient() {
    this.PATIENT.PAT_STATE = 'SUBMITTED';
    this.PATIENT.PAT_REFERRAL_ID = this.localService.USR.U_ID;
    this.PATIENT.PAT_REFORG = this.localService.USR.U_ORG;
    this.PATIENT.PAT_DATE_CREATE = this.appService.getCurrentDate();

    console.log(this.PATIENT);
    if (this.isRuleOfYearValid()) {
      this.crudService.patientCreate(this.PATIENT)
        .then((res) => {
          console.log(res);
          this.navCtrl.setRoot('HomePage');
        })
        .catch(err => console.log(err))
    } else {
      this.appService.alertError('Oops', 'Please set years correctly');
    }

  }

  saveDraft() {
    this.PATIENT.PAT_STATE = 'DRAFT';
    this.PATIENT.PAT_REFERRAL_ID = this.localService.USR.U_ID;
    this.PATIENT.PAT_REFORG = this.localService.USR.U_ORG;
    this.PATIENT.PAT_DATE_CREATE = this.appService.getCurrentDate();
    if (this.PATIENT.PAT_ID) {
      this.updatePatient(this.PATIENT)
        .then((res) => {
          console.log(res);
          this.appService.toastMsg('Save as draft...', 5000);
          this.navCtrl.setRoot('HomePage');
        })
        .catch(err => console.log(err))
    } else {
      this.crudService.patientCreate(this.PATIENT)
        .then((res) => {
          console.log(res);
          this.appService.toastMsg('Save as draft...', 5000);
          this.navCtrl.setRoot('HomePage');
        })
        .catch(err => console.log(err))
    }
  }

  updatePatient(PATIENT: iPatient) {
    console.log(this.PATIENT);
    return this.crudService.patientUpdate(PATIENT)
  }

  getData() {
    this.crudService.getBasicData()
      .then(() => {
        let basicinfos = this.localService.BASIC_INFOS;
        // console.log(res.data());
        this.CITIES = basicinfos.CITIES;
        this.DISABLED_PARTS = basicinfos.DISABLED_PARTS;
        this.DISABLED_REASONS = basicinfos.DISABLED_REASONS;
        this.DISABLED_SPONSORS = basicinfos.DISABLED_SPONSORS;
        this.AMPUTATION_PARTS = basicinfos.AMPUTATION_PARTS;
        this.AMPUTATION_REASONS = basicinfos.AMPUTATION_REASONS;
        this.AMPUTATION_SPONSORS = basicinfos.AMPUTATION_SPONSORS;
        this.JOBS = basicinfos.JOBS;
        console.log(this.CITIES);
      })
      .catch((err) => { console.log(err) })
  }

  selectCity(CITY: iLoc) {
    console.log(CITY);
    this.getDistrictinCity(CITY.CCODE);
  }

  getDistrictinCity(id) {
    this.crudService.getDistrictWard(id)
      .then((docSnap) => {
        this.LOCATIONS = docSnap.data().HANOI;
        console.log(this.LOCATIONS);
        this.DIST_IN_CITY = this.appService.removeDuplicateObjectFromArray(this.LOCATIONS, 'DCODE');
        console.log(this.DIST_IN_CITY);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  selectDist(DIST: iLoc) {
    console.log(DIST);
    this.WARDS_IN_DIST = this.LOCATIONS.filter(loc => {
      return loc.DCODE == DIST.DCODE
    })
    console.log(this.WARDS_IN_DIST);

  }

  selectWard(WARD: iLoc) {
    console.log(WARD);
    this.PATIENT.PAT_CONTACT_LOC = WARD;
  }

  updateToggleValue() {
    console.log(this.toggleValue);
    if (this.toggleValue) {
      this.PATIENT.PAT_HOME_ADDRESS = this.PATIENT.PAT_CONTACT_ADDRESS;
      this.PATIENT.PAT_HOME_WARD = this.PATIENT.PAT_CONTACT_WARD;
      this.PATIENT.PAT_HOME_DIST = this.PATIENT.PAT_CONTACT_DIST;
      this.PATIENT.PAT_HOME_CITY = this.PATIENT.PAT_CONTACT_CITY;
      this.PATIENT.PAT_HOME_LOC = this.PATIENT.PAT_CONTACT_LOC
    }
  }

  isRuleOfYearValid() {
    let YoB = this.PATIENT.PAT_YoB.substr(0, 4);
    let YoAM = this.PATIENT.PAT_AMPUTATION_YEAR.substr(0, 4);
    let YoNA = this.PATIENT.PAT_DISABLED_YEAR.substr(0, 4);;
    let YoARS = this.PATIENT.PAT_AMPUTATION_LAST_LEG_YEAR.substr(0, 4);;
    let YoNARS = this.PATIENT.PAT_DISABLED_SUPPORT_RECEIVED_YEAR.substr(0, 4);;
    console.log('YoB', YoB, 'YoAM', YoAM, 'YoNA', YoNA, 'YoARS', YoARS, 'YoNARS', YoNARS);
    if (this.PATIENT.PAT_KIND == 'AMPUTEE') {
      if (YoB > YoAM) {
        console.log('YoB > YoAM')
        return false
      };
      if (YoAM > YoARS) {
        console.log('YoARS > YoAM')
        return false
      };
      if (!YoAM || !YoARS) {
        console.log('!YoAM || !YoARS')
        return false
      };
    } else {
      console.log('non amputee')
      if (YoB > YoNA) {
        console.log('YoB > YoAM')
        return false
      };
      if (YoNA > YoNARS) {
        console.log('YoARS > YoAM')
        return false
      };
      if (!YoNA || !YoNARS) {
        console.log('!YoAM || !YoARS')
        return false
      };
    }
    return true;
  }

}
