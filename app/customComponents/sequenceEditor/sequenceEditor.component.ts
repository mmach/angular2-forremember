import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'sequence-editor',
    templateUrl: 'sequenceEditor.component.html',
    styleUrls: ['sequenceEditor.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class SequenceEditor implements OnInit {

    private jQuery: any = $;

    private unValidCount = 20;
    private resultText = "";

    private allowedDNACharacters = [
        "A", "T", "C", "G"
    ];

    private allowedRNACharacters = [
        "A", "U", "C", "G"
    ];

    private allowedProteinCharacters = [
        "A", "R", "N", "D", "C", "E", "Q", "G", "H", "I", "L", "K", "M", "F", "P", "S", "T", "W", "Y", "V"
    ];

    private _sequenceType = SequenceTypeEnum.Undefined;
    get sequenceType() {
        return this._sequenceType;
    }
    set sequenceType(value) {
        this._sequenceType = value;
    }

    get value() {
        this.codeMirrorComponent.setValue(this.codeMirrorComponent.getValue().replace(/[^\x20-\x7E]/gmi, ""));
        return this.codeMirrorComponent.getValue();
    }
    set value(value) {
        this.codeMirrorComponent.setValue(value.replace(/[^\x20-\x7E]/gmi, ""));
        this.validate();
    }

    private get textAreaHTMLElement() {
        return <HTMLTextAreaElement>this.el.nativeElement.querySelector("textarea");
    }

    private _codeMirrorComponent;
    private get codeMirrorComponent() {
        if (!this._codeMirrorComponent) {
            this._codeMirrorComponent = (<any>window).CodeMirror.fromTextArea(this.textAreaHTMLElement, {
                lineWrapping: true,
                styleSelectedText: true
            });
        }
        return this._codeMirrorComponent;
    }

    markers = [];

    constructor(private el: ElementRef) {

    }

    ngOnInit() {
        this.codeMirrorComponent;
    }

    validate(): boolean {
        this.resultText = "";

        return this.validateContent();
    }

    private validateContent(): boolean {
        if (this.sequenceType == SequenceTypeEnum.Undefined) {
            return true;
        }

        let content = this.value;

        this.markers.forEach((value) => value.clear());
        this.markers = [];

        let forbiddenCharacterIndexArray = [];

        let allowedCharacters = this.allowedDNACharacters;
        switch (this.sequenceType) {
            case SequenceTypeEnum.DNA:
                {
                    allowedCharacters = this.allowedDNACharacters;
                    break;
                }
            case SequenceTypeEnum.RNA:
                {
                    allowedCharacters = this.allowedRNACharacters;
                    break;
                }
            case SequenceTypeEnum.Protein:
                {
                    allowedCharacters = this.allowedProteinCharacters;
                    break;
                }
        }

        for (let i = 0; i < content.length; i++) {
            let currentCharacter = content[i];
            if (allowedCharacters.indexOf(currentCharacter) == -1) {
                forbiddenCharacterIndexArray.push(i);
            }
        }

        let activeDoc = this.codeMirrorComponent.getDoc();
        for (var i = 0; i < (forbiddenCharacterIndexArray.length > this.unValidCount ? this.unValidCount : forbiddenCharacterIndexArray.length); i++) {
            this.markers.push(activeDoc.markText({ line: 0, ch: forbiddenCharacterIndexArray[i] }, { line: 0, ch: forbiddenCharacterIndexArray[i] + 1 }, { className: "codeMirrorHighlighted" }));
        }

        if (forbiddenCharacterIndexArray.length != 0) {
            this.resultText = forbiddenCharacterIndexArray.length + " invalid character(s) founded!";
        } else if (content.length > 0) {
            this.resultText = "All character(s) are valid.";
        }

        return forbiddenCharacterIndexArray.length == 0;
    }

    makeResizable() {
        var thisRef = this;
        var resultTextSpanHeight = 25;
        this.jQuery('.sequenceEditorValidatedContent').resizable({
            resize: function () {
                thisRef._codeMirrorComponent.setSize(thisRef.jQuery(this).width(), thisRef.jQuery(this).height() - resultTextSpanHeight);
                thisRef._codeMirrorComponent.refresh();
            }
        });
    }

    ngAfterViewInit() {
        this.makeResizable();
    }
}

export enum SequenceTypeEnum {
    Undefined,
    DNA,
    RNA,
    Protein
}

