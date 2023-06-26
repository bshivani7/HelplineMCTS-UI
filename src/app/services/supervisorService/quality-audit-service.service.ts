import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { ConfigService } from '../config/config.service';
import { InterceptedHttp } from './../../http.interceptor';

@Injectable()
export class QualityAuditService {

    commonBaseURL: any;
    admin_Base_Url: any;
    _mctsbaseUrl: any;
    force_logout_url: any = '';
    getServicesUrl: any = '';
    getRolesUrl: any = '';
    getServiceProviderID_url: any = '';
    _calltypesurl: any = '';
    filterCallListUrl: any = '';
    getCallSummaryUrl: any = '';
    getAllAgents_Url: any = '';
    getRoleSpecificAgentIDs_url: any = '';

    getConginentalAnomalies_url: any = '';
    getComplaints_url: any = '';
    audioURL: any;
    constructor(
        private _config: ConfigService,
        private httpIntercept: InterceptedHttp) {
        this.commonBaseURL = this._config.getCommonBaseURL();
        this.admin_Base_Url = this._config.getAdminBaseURL();
        this._mctsbaseUrl = this._config.getMctsBaseURL();

        this.getServicesUrl = this.admin_Base_Url + 'm/role/serviceNew';
        this.getRolesUrl = this.commonBaseURL + 'user/getRolesByProviderID';
        this.getServiceProviderID_url = this.admin_Base_Url + 'getServiceProviderid';
        this._calltypesurl = this.commonBaseURL + 'call/getCallTypesV1/';
        this.filterCallListUrl = this.commonBaseURL + 'call/filterCallList';
        this.getCallSummaryUrl = this._mctsbaseUrl + 'mctsOutboundCallDetailController/case/sheet';
        this.getAllAgents_Url = this.admin_Base_Url + 'getAllAgentIds';
        this.getRoleSpecificAgentIDs_url = this.commonBaseURL + 'user/getAgentByRoleID';


        this.getComplaints_url = this.commonBaseURL + 'feedback/getFeedbacksList';
        this.getConginentalAnomalies_url = this._mctsbaseUrl + 'congenitalAnomaliesController/get/child/conganomolies'
        this.audioURL =  this.commonBaseURL+"call/getFilePathCTI";
    }

    getServices(userID) {
        return this.httpIntercept.post(this.getServicesUrl,
            { 'userID': userID })
            .map(this.handleState_n_ServiceSuccess).catch(this.handleError);
    }

    getRoles(obj) {
        return this.httpIntercept.post(this.getRolesUrl, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getComplaints(psmID, benRegID, benCallID) {
        return this.httpIntercept.post(this.getComplaints_url,
            {
                'serviceID': psmID,
                'beneficiaryRegID': benRegID,
                'benCallID': benCallID
            })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getCongenitalAnomalies(benCallID) {
        return this.httpIntercept.post(this.getConginentalAnomalies_url,
            {
                'callDetailID': benCallID
            })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getServiceProviderID(providerServiceMapID) {
        return this.httpIntercept.post(this.getServiceProviderID_url, { 'providerServiceMapID': providerServiceMapID })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getCallTypes(providerServiceMapID) {
        return this.httpIntercept.post(this._calltypesurl,
            { 'providerServiceMapID': providerServiceMapID })
            .map(this.handleSuccess).catch(this.handleError);
    }

    getFilteredCallList(obj) {
        return this.httpIntercept.post(this.filterCallListUrl, obj)
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getCallSummary(benCallID) {
        return this.httpIntercept.post(this.getCallSummaryUrl,
            {
                'callDetailID': benCallID
            })
            .map(this.handleSuccess)
            .catch(this.handleError);
    }

    getAllAgents(providerServiceMapID) {
        return this.httpIntercept
            .post(this.getAllAgents_Url,
            { 'providerServiceMapID': providerServiceMapID })
            .map(this.handleSuccess)
            .catch(this.handleError)
    }
    getRoleSpecificAgents(providerServiceMapID, roleID) {
        return this.httpIntercept
            .post(this.getRoleSpecificAgentIDs_url,
            {
                'providerServiceMapID': providerServiceMapID,
                'RoleID': roleID
            })
            .map(this.handleSuccess)
            .catch(this.handleError)
    }

    getAudio(agentid,sessionID) {
        return this.httpIntercept.post(this.audioURL,
            {
                'agentID': agentid,
                'callID': sessionID
            }).map(this.handleSuccess).catch(this.handleError);
    }

    handleSuccess(response: Response) {
        if (response.json().data) {
            return response.json().data;
        } else {
            return Observable.throw(response.json());
        }
    }

    handleState_n_ServiceSuccess(response: Response) {
        let result = [];
        result = response.json().data.filter(function (item) {
            if (item.statusID !== 4) {
                return item;
            }
        });
        return result;
    }

    private handleError(error: Response | any) {
        return Observable.throw(error.json());
    };

}