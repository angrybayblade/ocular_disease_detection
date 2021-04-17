import React from 'react';
import './App.css';

let information = {
  Normal:[

  ],
  Diabetes:[
      {
          title:"Diabetes types",
          data:`Diabetes mellitus, commonly known as diabetes, is a metabolic disease that causes high blood sugar. The hormone insulin moves sugar from the blood into your cells to be stored or used for energy. With diabetes, your body either doesn’t make enough insulin or can’t effectively use the insulin it does make.

          Untreated high blood sugar from diabetes can damage your nerves, eyes, kidneys, and other organs.
          
          There are a few different types of diabetes:
          
          Type 1 diabetes is an autoimmune disease. The immune system attacks and destroys cells in the pancreas, where insulin is made. It’s unclear what causes this attack. About 10 percent of people with diabetes have this type.
          Type 2 diabetes occurs when your body becomes resistant to insulin, and sugar builds up in your blood.
          Prediabetes occurs when your blood sugar is higher than normal, but it’s not high enough for a diagnosis of type 2 diabetes.
          Gestational diabetes is high blood sugar during pregnancy. Insulin-blocking hormones produced by the placenta cause this type of diabetes.
          A rare condition called diabetes insipidus is not related to diabetes mellitus, although it has a similar name. It’s a different condition in which your kidneys remove too much fluid from your body.
          
          Each type of diabetes has unique symptoms, causes, and treatments. Learn more about how these types differ from one another.`
      },
      {
          title:"General Symptoms",
          data:`The general symptoms of diabetes include:

          increased hunger,
          increased thirst,
          weight loss,
          frequent urination,
          blurry vision,
          extreme fatigue,
          sores that don’t heal,`
      },
      {
          title:"Symptoms in men",
          data:`In addition to the general symptoms of diabetes, men with diabetes may have a decreased sex drive, erectile dysfunction (ED), and poor muscle strength.`
      },
      {
          title:"Symptoms in women",
          data:`Women with diabetes can also have symptoms such as urinary tract infections, yeast infections, and dry, itchy skin.`
      }
  ]
}

const App = (props) =>{

  let [ disease, diseaseState ] = React.useState({
    name:"Click On Predict To View Results",
    info:[
      { title:" Disease Information ", data:" Disease Information " }
    ]
  })

  function readImage(e){
      let { target } = e
      let { files, id } = target;

      if (FileReader && files && files.length) {
          let reader = new FileReader();
          reader.onload = function () {
              document.getElementById(`${id}-eye`).src = reader.result;
          }
          reader.readAsDataURL(files[0]);
      }
  }

  async function predict (){
    const formData = new FormData();

    formData.append('left', document.getElementById("left").files[0] , 'left');
    formData.append('right', document.getElementById("right").files[0] , "right");
    // formData.append('age', document.getElementById("age").value );
    // formData.append('gender', document.getElementById("gender").value );

    const options = {
      method: 'POST',
      body: formData,
    };
    
    await fetch(
        'http://localhost/predict', options
    ).then(response=>response.json()).then(data=>{
        disease.name = "Result : " + data.output + " | Probability : " + data.probability.toString().slice(0,6);
        disease.info = information[data.output];
        diseaseState({
          ...disease
        })
    });
}

  const Map = (props) =>{
    React.useEffect(()=>{
      const uluru = { lat: -25.344, lng: 131.036 };
      const map = new window.google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: uluru,
      });
      const marker = new window.google.maps.Marker({
        position: uluru,
        map: map,
      });
    })
    return (
      <div className="map">

      </div>
    )
  }

  return (
    <div className="app">
      <div className="grid-box">
        <div className="title">
          Ocular Disease Detection
        </div>
        <div className="patient-info">
          <div className="title">
            Patient Info
          </div>
          <div className="form">
            <div className="field">
              <div className="name">
                First Name
              </div>
              <input />
            </div>
            <div className="field">
              <div className="name">
                Last Name
              </div>
              <input />
            </div>
            <div className="field">
              <div className="name">
                Age
              </div>
              <input type="number" />
            </div>
            <div className="field">
              <div className="name">
                Gender
              </div>
              <input />
            </div>
          </div>
          <div className="images">
            <div className="image">
              <div>Left Eye <input type="file" id="left" onChange={readImage} /></div>
              <label htmlFor="left" > Click Here To Upload </label>
              <img id="left-eye" />
            </div>
            <div className="image">
              <div>Right Eye <input type="file" id="right" onChange={readImage} /> </div>
              <label htmlFor="right" > Click Here To Upload </label>
              <img id="right-eye" />
            </div>
          </div>
          <div className="predict">
            <button onClick={predict}>Predict</button>
          </div>
        </div>
      </div>
      <div className="grid-box">
        <div className="output">
          <div className="title"> { disease.name } </div>
          <div className="information">
            {
              disease.info.map((elem,i)=>{
                return (
                  <div className="info" key={i}>
                    <div className="title"> 💉 {elem.title} </div>
                    <div className="data">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      {elem.data}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </div>
                  </div>
                )
              })
            }
          </div>
          {/* <div className="map" id="map">
            <Map />
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default App;

