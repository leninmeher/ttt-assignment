import React from 'react'
import axios from "axios"
import Chart from "react-apexcharts";
import Loader from '../Loader/Loader';
import "./Home.css"

function Home() {

    const [data, setData] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isReady, setIsReady] = React.useState(false)

    const chartData = (dict) => {

        var categories = Object.keys(dict)
        var tempData = [];
        for(let i=0; i<categories.length;i++){
            tempData.push(dict[categories[i]])
        }
        console.log(categories)

        const finalData = {
            options: {
              chart: {
                id: "basic-bar",
                animations: {
                    speed: 1000
                }
              },
              theme: {
                palette: 'palette3'
              },
              legend: {
                show: false
              },
              plotOptions: {
                bar: {
                  distributed: true
                }
              },
              xaxis: {
                categories: categories,
                labels: {
                    style: {
                      fontSize: '16px'
                    }
                  }
              }
            },
            series: [
              {
                name: "frequency",
                data: tempData
              }
            ]
          }

        return finalData
    }

    const sortDict = async (dict) => {

        var items = Object.keys(dict).map(
            (key) => { return [key, dict[key]]
        });

        items.sort(
            (first, second) => { return second[1] - first[1] }
        );

        var keys = items.map(
            (e) => { return e[0] }
        );

        var sortedDict = {}
        for(let i=0;i<20;i++){
            sortedDict[keys[i]]= dict[keys[i]]
        }

        return sortedDict
        
    }

    const fetch = async () => {
        setIsLoading(true)
        const res = await axios.get('https://www.terriblytinytales.com/test.txt')
        try {
            const arr = res.data.split("\n").join(" ").split(" ")
            
            var n = arr.length;
            for(let i=0;i<n;i++){
                arr[i]=arr[i].replace(/[^a-zA-Z ]/g, "")
                if(arr[i].length === 0 || arr[i].length === 1){
                    arr.splice(i, 1);
                    n--;
                }
            }

            var freqMap = {};
            arr.forEach((word) => {
                if(!freqMap[word]) {
                    freqMap[word] = 0;
                }
                freqMap[word] += 1;
            });

            const sortedKeys = await sortDict(freqMap)
            

            const finalData = chartData(sortedKeys)

            setData(finalData)
            console.log(finalData)
            setIsLoading(false)
            setIsReady(true)
        } catch(err) {
            console.log(err)
            setIsLoading(false)
        }
    }

    return (
        <>
        
        <div className="home-parent">
        <h2 style={{margin:"10px"}}>Word's Frequency</h2>
        <h5 style={{margin:"0"}}> Assignment by Lenin Meher </h5>
            <div style={{marginTop:"50px"}}>
            {isLoading && <Loader/> }
            {isReady && data!==null && <Chart options={data.options} series={data.series} type="bar" height="350" width="800" />}
            </div>
            <button disabled={isLoading} onClick={fetch} className="submit-button">Submit</button>
        </div>
        </>
    )
}

export default Home