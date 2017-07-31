import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContainersService } from '../services/containers.service';
import { ConceptsService } from '../services/concepts.service';


@Component({
    templateUrl: 'administration.component.html'
})

export class AdministrationComponent implements OnInit {

    constructor(
        private containersService: ContainersService,
        private conceptsService: ConceptsService,
        public router: Router) {
    }

    ngOnInit() {
    }

    InitializeElasticSearchContainers() {
            this.containersService.InitializeElasticSearch()
                .subscribe();
            this.router.navigateByUrl('');
    }

    InitializeElasticSearchConcepts() {
        this.conceptsService.initializeElasticSearchConcepts().subscribe();
        this.router.navigateByUrl('');
    }
    cancel() {
        this.router.navigateByUrl('');
    }
}

