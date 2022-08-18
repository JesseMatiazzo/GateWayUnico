import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { CameraServiceService } from '../Services/camera.service';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  public imageBase64: string | undefined;
  @Output() getPicture = new EventEmitter<WebcamImage>();
  showWebcam = true;
  isCameraExist = true;

  //OBJETO QUE ME RETORNA OS ERROS
  errors: WebcamInitError[] = [];
  //OBJETO QUE IRÁ PEGAR OS EVENTOS COMO EXEMPLO O CLICK DA FOTO
  private trigger: Subject<void> = new Subject<void>();
  //OBJETO QUE IRÁ POSSIBILITAR A TROCA DE CÂMERSA
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private camaraService: CameraServiceService) { }


  ngOnInit(): void {
    //VERIFICANDO SE EXISTE ALGUMA CÂMERA
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.isCameraExist = mediaDevices && mediaDevices.length > 0;
      });
  }
  //EFETUA O EVENTO DE TIRAR A FOTO
  takeSnapshot(): void {
    this.trigger.next();
  }
  //EVENTO PARA TIRAR UMA OUTRA FOTO
  anotherPicture() {
    this.showWebcam = true;
    this.getPicture.emit(undefined);
    this.imageBase64 = undefined;
  }
  //EVENTO DE ERROS
  handleInitError(error: WebcamInitError) {
    //CASO O USUÁRIO NÃO PERMITA O USO DA CÂMERA
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      this.toastr.error("Para prosseguir, é necessário que habilite a câmera!", "ERRO AO ACESSAR A CÂMERA")
      this.errors.push(error);
    }
  }

  changeWebCame(directionOrDeviceId: boolean | string) {
    this.imageBase64 = undefined;
    this.nextWebcam.next(directionOrDeviceId);
  }

  handleImage(webcamImage: WebcamImage) {
    this.imageBase64 = webcamImage.imageAsBase64;
    this.getPicture.emit(webcamImage);
    this.showWebcam = false;
  }
  //ENVIA A FOTO PARA SERVIDOR
  public sendPhoto() {
    this.spinner.show("Enviando foto...");
    this.camaraService.enviarImagem(this.imageBase64).subscribe({
      next: (result: any) => {
        this.toastr.success("Foto enviada com sucesso!")
      },
      error: (error: Error) => {
        this.toastr.error(error.message, "ERRO AO ENVIAR A FOTO");
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }
  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

}
