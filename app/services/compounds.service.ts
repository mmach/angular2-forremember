import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';   // Load all features

import { ICompound } from '../models/Compound';
import { IConcept } from '../models/concept';
import { environment } from "../environment";
import { BaseService } from "./base.service";
import { IConceptType } from "../models/concepttype";

@Injectable()
export class CompoundsService extends BaseService {
    private getContainersURL: string = environment.apiUrl + '/Containers';
    constructor(public http: Http) {
        super(http);
    }

    getCompounds(): ICompound[] {
        var expDate = new Date();
        expDate.setMonth(expDate.getMonth() + 3);

        var conceptRNA = new IConcept;
        conceptRNA.name = "971087286";
        conceptRNA.conceptText = "GGCGGGGCGGGAGGGCGGCGCGGAGTGCGCCGGCGCGTCGTCGGGGACGCCGGGTCCAGGATCTTGCTAGGGAACCAGTGTTGTCGCGTCGTCCCGCCCCCTCGGGGCTTTTGCTCCCGTTAACTGTCGGCGGGGCAGGC"; 

        var conceptProtein = new IConcept;
        conceptProtein.name = "827513780";
        conceptProtein.conceptText = "MKLIDRLSEIVGVAHVVTGGGPEGPAPWEQDWRGRSKGRALAMVRPGSTAEVADVVKLCAAEKVSIVPQGGNTGLVDGSIPDTSGTQVVMNLGRLKAVRSIDRKNMTITVEAGCILQSLHEVVEDAGFLFPLSLAAKGSCTIGGNLATNAGGTQVVRYGNARSLCLGLEVVTASGEIWSALSGLRKDNTGYDLRDLFIGSEGTLGIITAATMQLYPRAASQLTAWAALPSIHAALELLERARRVLSASLTGFELMGRFPVSMVRQHLSDLRMPALSTDDPYFVLIECSDAEESHARSLVEGLLSDAIESGEVSDAVVAESLSQVRDLWEVRESIPLAAYKEGLMAAHDISLPIASIPQFVDVTESRLLEAFPGVRISNFGHLGDGNLHYNVHAPSGESAAEFLRRYEEQIRQIVYDSVHQFAGSFSAEHGIGRLKLHWMDSYKSSVELNMMRSIKKALDPSSLMNPGCVVGGG"; 
        
       // var CompoundsList = [new ICompound (1, conceptRNA, 1500, 97.1, new Date(), expDate)
       //     , new ICompound (2, conceptRNA, 293, 72.7, new Date(), expDate)
       //     , new ICompound (2, conceptProtein, 18.7, 82.3, new Date(), expDate)
       //     , new ICompound (2, conceptProtein, 97.2, 2.7, new Date(), expDate)
       //     ]
        return null;
    }

}
