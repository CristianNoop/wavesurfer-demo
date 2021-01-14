# Ülesanne – helifaili mängiv ja visualiseeriv rakendus.

## Stack:
Java, Spring, Maven, Angular, wavesurfer.js, ülejäänu vastavalt enda eelistustele

## Eesmärk:
Arendada veebirakendus, mis võimaldab kasutajal mängida ja visualiseerida helifaile.  
Realiseeri MVP täies ulatuses. Eraldi kasutajahaldust ja autentimist vaja arendada ei ole.  
Täiendavatest funktsionaalsustest tee arendusi vastavalt oma eelistusele vabalt valitud järjekorras. Kui kõike ei jõua ole valmis ka selgitama, miks ühte või teist täiendavat funktsionaalsust realiseerisid/ei realiseerinud. Proovi ka MVP-d realiseerides juba mõelda sellele, kuidas rakendust ehitada nii, et hiljem täiendavate funktsionaalsuste lisamine raskusi ei valmistaks.  


## [Backendi käivitamine](https://github.com/CristianNoop/wavesurfer-demo/tree/master/waveform-player-backend/README.md)  
## [Frontendi käivitamine](https://github.com/CristianNoop/wavesurfer-demo/tree/master/waveform-player-frontend/README.md)

## Lisatud funktsionaalsused  
* Kasutaja saab rakendusse laadida .mp3 faili    
*	Rakendus loob mp3-st waveformid (eraldi vasak ja parem kanal) ning kuvab neid kasutajale   
*	Kasutaja saab helifaili veebirakenduses mängida, pausile panna ning taaskäivitada.  
*	Rakendus kuvab heli mängimisel kasutajale heli esitamise hetkeaega ja faili kogupikkust.  
*	Helifaili mängimisel visualiseeritakse kasutajale ka waveformil hetkel mängitav aeg
*	Kasutaja saab reguleerida helitugevust kahe kanali osas eraldi.   


*	Kasutaja peab saama heli edasi- ja tagasi kerida (5s võrra edasi/tagasi hüpata)  
*	Kasutaja peab saama heli mängida kiirenduse/aeglustusega (peab saama muuta helifaili esituskiirust)  
*	Kasutaja peab saama helifailid asetada kettal asuvasse rakenduse konfiguratsioonis määratud kausta ning rakenduses kuvatakse nimekirja kõikidest kaustas asuvatest failidest. Kasutaja saab valida ühe faili nimekirjast, mille tulemusel kasutab funktsionaalsust nii, nagu see MVP-s ja arendatud lisafunktsionaalsustes toimib. Lisa nimekirjavaatesse atribuudid, mida pead faili kuvamisel kasutajale mõistlikuks.  
*	Kasutaja peab saama kasutajaliidese vahendusel kaustas olevaid faile juurde lisada/ kustutada.  
*	Kasutaja peab saama waveformil märkida regiooni – st hiirega waveformil lohistades teha mingi osa waveformist „aktiivseks“  ning lisada vastava regiooni kohta kommentaar/märge.  
*	Kasutaja peab saama waveformil märkida mitut erinevat regiooni (vt eelmine punkt).  
*	Kasutaja peab saama ühte märgitud regiooni panna korduvasse esitusse (loop) – st rakendus mängib korduvalt heli vaid märgitud regiooni piires, seni kuni kasutaja korduva esituse peatab.  

## Lisamata funktsionaalsused
*	Kasutaja peab saama kasutada ekvalaiseri funktsionaalsust  - AJA TÕTTU LISAMATA  
*	Kasutajale kuvatakse waveforme korraga nii täispikkuses (kui nt helifail on 5min pikk, siis kuvatakse ka waveform terve 5m osas), kui hetkel mängitava koha lähedalt (nt üks 20s waveformi tükk korraga, selle lõppemisel järgmine 20s) - AJA TÕTTU LISAMATA  
* Failide streamimine - failide streamimine toimib, aga lõhub ära pleieri kerimise funktisonaalsused. Aja tõttu probleem lahendamata ja implementeerimata.
