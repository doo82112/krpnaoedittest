scenexml = "";

const scenexmlbk = "<krpano><include url='skin/vtourskin.xml' /><include url='./actions.xml' /><action name='startup' autorun='onstart'>if(startscene === null OR !scene[get(startscene)], copy(startscene,scene[0].name); );loadscene(get(startscene), null, MERGE);if(startactions !== null, startactions() );</action><scene name='scene_108b_laundry' title='108b_laundry' onstart='' thumburl='panos/108b_laundry.tiles/thumb.jpg' lat='' lng='' heading='' autoload='true'><control bouncinglimits='calc:image.cube ? true : false' /><view hlookat='0.0' vlookat='0.0' fovtype='MFOV' fov='120' maxpixelzoom='2.0' fovmin='70' fovmax='140' limitview='auto' /><preview url='panos/108b_laundry.tiles/preview.jpg' /><image><cube url='panos/108b_laundry.tiles/pano_%s.jpg' /></image><hotspot/><hotspot/></scene><scene></scene></krpano>";

const data = {
    "xml": {
        "@css": "script",
        "javascript": {
            "html": "css"
        }
    }
};




function krpano_onready_callback(krpano_interface) {
    //alert('파노라마뷰어가 로드되었습니다.');
    krpano = krpano_interface;
    x2js = new X2JS();

    //toxml(data);

};

function getPanoxml() {
    var panoid = document.getElementById('panoidinput').value;
    if (panoid == '') {
        panoid = '0000';
    }
    console.log(panoid);

    //https://port-0-krpnaoedittest-p8xrq2mlfci9uc5.sel3.cloudtype.app

    fetch(`http://127.0.0.1:3000/xmldatas/${panoid}`)
        .then((response) => {
            if (response.ok) {

                return response.json();
            }

            //return Promise.reject();
        })
        .then((data) => {
            if (data) {
                console.log(data);
                scenexml = data.krpanoxml;
                if (krpano) {
                    krpano.call("setscenexml(" + scenexml + ");");
                }
                jsobject = x2js.xml_str2json(scenexml);
                console.log(jsobject);

                if (jsobject['krpano'] == undefined) {
                    console.log(key);
                } else {
                    krpanojsobject = jsobject['krpano'];
                }


                var new_xml = x2js.json2xml_str(jsobject);
                console.log(new_xml);

                if (panoid == '0000') {
                    document.getElementById('panoidinput').value = 'input project name';
                    document.getElementById('panoidinput').placeholder = 'input project name';
                } else {
                    document.getElementById('panoidinput').value = '';
                    document.getElementById('panoidinput').placeholder = panoid;
                }

            }

            //document.getElementById('sound').innerHTML = data.sound

        })
        .catch((err) => {
            console.log('no pano data such as');
            // 3. get error messages, if any
            document.getElementById('panoidinput').value = '';
            document.getElementById('panoidinput').placeholder = 'no pano data such as';

        });

}

function addhotspot() {

    if (krpano) {
        //krpano.call("addhotspotassstyle(" + dateTime + ");");

        var h = krpano.get("view.hlookat");
        var v = krpano.get("view.vlookat");
        var hs_name = "hs" + ((Date.now() + Math.random()) | 0);	// create unique/randome name
        krpano.call("addhotspot(" + hs_name + ")");
        krpano.set("hotspot[" + hs_name + "].url", "skin/infoclick.png");
        krpano.set("hotspot[" + hs_name + "].ath", h);
        krpano.set("hotspot[" + hs_name + "].atv", v);
        krpano.set("hotspot[" + hs_name + "].distorted", false);
        krpano.set("hotspot[" + hs_name + "].ondown", "set(dragging, true);draghotspot();");
        krpano.set("hotspot[" + hs_name + "].onup", "set(dragging, false);");
        var oklayername = hs_name + '_obtn';
        var xlayername = hs_name + '_xbtn';

        krpano.call("addlayer(" + oklayername + ")");
        krpano.set("layer[" + oklayername + "].parent", "hotspot[" + hs_name + "]");
        krpano.set("layer[" + oklayername + "].url", "skin/check.png");
        krpano.set("layer[" + oklayername + "].width", "50");
        krpano.set("layer[" + oklayername + "].height", "50");
        krpano.set("layer[" + oklayername + "].align", "leftbottom");
        krpano.set("layer[" + oklayername + "].edge", "lefttop");
        krpano.set("layer[" + oklayername + "].x", "-10");

        krpano.call("addlayer(" + xlayername + ")");
        krpano.set("layer[" + xlayername + "].parent", "hotspot[" + hs_name + "]");
        krpano.set("layer[" + xlayername + "].url", "skin/cancel.png");
        krpano.set("layer[" + xlayername + "].width", "50");
        krpano.set("layer[" + xlayername + "].height", "50");
        krpano.set("layer[" + xlayername + "].align", "rightbottom");
        krpano.set("layer[" + xlayername + "].edge", "righttop");
        krpano.set("layer[" + xlayername + "].x", "-10");



        if (krpano.get("device.html5")) {
            // for HTML5 it's possible to assign JS functions directly to krpano events
            //krpano.set("hotspot[" + hs_name + "].onclick", function (hs) {
            krpano.set("layer[" + oklayername + "].onclick", function (hs) {

                doneedithotspot(
                    krpano.get("scene[get(xml.scene)].index"),
                    hs_name,
                    krpano.get("hotspot[" + hs_name + "].url"),
                    krpano.get("hotspot[" + hs_name + "].ath"),
                    krpano.get("hotspot[" + hs_name + "].atv"),
                    krpano.get("hotspot[" + hs_name + "].scale"),
                    krpano.get("hotspot[" + hs_name + "].zoom"),
                    krpano.get("hotspot[" + hs_name + "].onclick")
                );

            }.bind(null, hs_name));

            krpano.set("layer[" + xlayername + "].onclick", function (hs) {
                krpano.call("removehotspot(" + hs_name + ")");
                removehotspotobject(hs_name);
            }.bind(null, hs_name));
        }
        else {
            // for Flash the js() action need to be used to call from Flash to JS (this code would work for Flash and HTML5)
            //krpano.set("hotspot[" + hs_name + "].onclick", "js( alert(calc('hotspot \"' + name + '\" clicked')) );savehotspot(" + hs_name + ");");
        }
    }
}

function opencontrollayer(hs_name) {
    if (krpano) {
        var oklayername = hs_name + '_obtn';
        var xlayername = hs_name + '_xbtn';

        krpano.call("addlayer(" + oklayername + ")");
        krpano.set("layer[" + oklayername + "].parent", "hotspot[" + hs_name + "]");
        krpano.set("layer[" + oklayername + "].url", "skin/check.png");
        krpano.set("layer[" + oklayername + "].width", "50");
        krpano.set("layer[" + oklayername + "].height", "50");
        krpano.set("layer[" + oklayername + "].align", "leftbottom");
        krpano.set("layer[" + oklayername + "].edge", "lefttop");
        krpano.set("layer[" + oklayername + "].x", "-10");

        krpano.call("addlayer(" + xlayername + ")");
        krpano.set("layer[" + xlayername + "].parent", "hotspot[" + hs_name + "]");
        krpano.set("layer[" + xlayername + "].url", "skin/cancel.png");
        krpano.set("layer[" + xlayername + "].width", "50");
        krpano.set("layer[" + xlayername + "].height", "50");
        krpano.set("layer[" + xlayername + "].align", "rightbottom");
        krpano.set("layer[" + xlayername + "].edge", "righttop");
        krpano.set("layer[" + xlayername + "].x", "-10");

        if (krpano.get("device.html5")) {
            // for HTML5 it's possible to assign JS functions directly to krpano events
            //krpano.set("hotspot[" + hs_name + "].onclick", function (hs) {
            krpano.set("layer[" + oklayername + "].onclick", function (hs) {

                doneedithotspot(
                    krpano.get("scene[get(xml.scene)].index"),
                    hs_name,
                    krpano.get("hotspot[" + hs_name + "].url"),
                    krpano.get("hotspot[" + hs_name + "].ath"),
                    krpano.get("hotspot[" + hs_name + "].atv"),
                    krpano.get("hotspot[" + hs_name + "].scale"),
                    krpano.get("hotspot[" + hs_name + "].zoom"),
                    krpano.get("hotspot[" + hs_name + "].onclick")
                );

            }.bind(null, hs_name));

            krpano.set("layer[" + xlayername + "].onclick", function (hs) {
                krpano.call("removehotspot(" + hs_name + ")");
                removehotspotobject(hs_name);
            }.bind(null, hs_name));
        }
        else {
            // for Flash the js() action need to be used to call from Flash to JS (this code would work for Flash and HTML5)
            //krpano.set("hotspot[" + hs_name + "].onclick", "js( alert(calc('hotspot \"' + name + '\" clicked')) );savehotspot(" + hs_name + ");");
        }

        krpano.set("hotspot[" + hs_name + "].ondown", "set(dragging, true);draghotspot();");
        krpano.set("hotspot[" + hs_name + "].onup", "set(dragging, false);");
    }
}

function removehotspotobject(scene_index, hs_name) {
    if (krpanojsobject) {
        var sceneobject = krpanojsobject['scene'][0];
        var hotspotobjects = sceneobject['hotspot'];
        console.log(hotspotobjects);
        var selectindex = -1;
        for (let i = 0; i < hotspotobjects.length; i++) {
            if (hotspotobjects[i]._name == hs_name) {
                selectindex = i;
            }
        }
        if (selectindex > 0) {
            hotspotobjects.splice(selectindex, 1);
        }
        console.log(hotspotobjects);
    }
}

function callsavexml() {
    var x_xml = x2js.json2xml_str(jsobject);
    //var x_xml = krpano.get("xml.content");
    console.log(x_xml);
    //var panoid = document.getElementById('panoidinput').placeholder;
    var panoid = document.getElementById('panoidinput').value;
    if (panoid == 'input project name') {
        alert('제목을 입력하고 저장해주세요');
    } else {
        if (krpano) {
            krpano.call("setscenexml(" + x_xml + ");");
        }
        console.log(panoid);
        fetch(`http://127.0.0.1:3000/xmldatas/update`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                panoId: panoid,
                krpanoxml: x_xml,
            }),
        }).then((response) => console.log(response));
    }

}

function setstartscene() {
    if (krpano) {
        if (krpanojsobject) {
            var scene_index = krpano.get("scene[get(xml.scene)].index");
            krpanojsobject['scene'].forEach(element => {
                element._autoload = false;
            });
            krpanojsobject['scene'][scene_index]._autoload = true;
        }
    }

}

function doneedithotspot(scene_index, name, url, ath, atv, scale, zoom, onclick) {
    console.log('scene_index: ' + scene_index + ' name: ' + name + ' url: ' + url + ' onclick: ' + onclick);
    krpano.set("hotspot[" + name + "].onclick", "opencontrollayer(" + name + ")");
    onclick = krpano.get("hotspot[" + name + "].onclick");
    console.log(onclick);
    if (krpanojsobject) {
        var sceneobject = krpanojsobject['scene'][scene_index];
        //console.log(krpanojsobject['scene']);
        krpanojsobject['scene'].forEach(element => {
            element._autoload = false;
            console.log(element.autoload);

        });


        krpanojsobject['scene'][scene_index]._autoload = true;



        var hotspotobjects = sceneobject['hotspot'];

        var hotspot_obj = { _name: name, _url: url, _ath: ath, _atv: atv, _scale: scale, _zoom: zoom, _onclick: onclick };
        var issame = false;
        console.log(hotspot_obj._name);
        hotspotobjects.forEach(element => {
            if (element._name == hotspot_obj._name) {
                Object.assign(element, hotspot_obj);
                issame = true;
            }
        });

        if (!issame) {
            hotspotobjects.push(hotspot_obj);
        }




        console.log(sceneobject);

        console.log(krpanojsobject);

        var x_xml = x2js.json2xml_str(jsobject);
        console.log(x_xml);
        if (krpano) {
            krpano.call("setscenexml(" + x_xml + ");");
        }
        jsojbect = null;
        jsobject = x2js.xml_str2json(x_xml);
        if (jsobject['krpano'] == undefined) {
            console.log(key);
        } else {
            krpanojsobject = jsobject['krpano'];
        }

    }
}
