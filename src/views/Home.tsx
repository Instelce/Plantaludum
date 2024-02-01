import Navbar from "../components/Organisms/Navbar/Navbar";
import Button from "../components/Atoms/Buttons/Button";
import {Link} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {flore} from "../services/api/flore";
import {getAnotherFormat} from "../utils/helpers";

function Home() {
  return (
    <div className="home">
      <Navbar.Root>
        <Navbar.Left>
          <Link to="/explorer">Explorer</Link>
        </Navbar.Left>

        <Navbar.Right>
          <Link to="/connexion">Connexion</Link>
          <Button asChild>
            <Link to="/inscription">Inscription</Link>
          </Button>
        </Navbar.Right>
      </Navbar.Root>

      <HomeHeader/>

    </div>
  );
}

function HomeHeader() {
  const [plantsImagesData, setPlantsImagesData] = useState([])
  const [imagesLoadedCount, setImagesLoadedCount] = useState(0)
  const plantsWallRef = useRef<HTMLDivElement>(null)

  const plantsQuery = useQuery({
    queryKey: ["home-plants"],
    queryFn: () => flore.plants.random(30),
  })

  const plantsImagesQuery = useQuery({
    queryKey: ["home-plants-images"],
    queryFn: () => {
      if (plantsQuery.isSuccess) {
        return flore.images.getWithPlantsIds(plantsQuery.data?.map(plant => plant.id))
      }
    },
    enabled: false,
  })

  // Line slide of plants images
  useEffect(() => {
    if (plantsWallRef.current) {
      let lines = plantsWallRef.current.querySelectorAll(".line")
      console.log("lines", lines)
      lines[0].style.transform = "translateX(-2%)";
      lines[1].style.transform = "translateX(-18%)";
      lines[2].style.transform = "translateX(-8%)";
    }
  }, []);

  // get images
  useEffect(() => {
    if (plantsQuery.isSuccess) {
      plantsImagesQuery.refetch()
    }
  }, [plantsQuery.isSuccess]);

  // split data of plantsImagesQuery into 3 arrays of 10 plants images
  useEffect(() => {
    if (plantsImagesQuery.isSuccess && plantsImagesData.length === 0) {
      const chunkSize = 10;
      for (let i = 0; i < plantsImagesQuery.data?.length; i += chunkSize) {
        const chunk = [...plantsImagesQuery.data!].slice(i, i + chunkSize);
        setPlantsImagesData(prev => prev.concat([chunk]))
      }
    }
  }, [plantsImagesQuery.isSuccess]);

  useEffect(() => {
    console.log(imagesLoadedCount)
  }, [imagesLoadedCount]);

  return (
    <>
      <header>

        {/* Plant wall */}
        {plantsImagesQuery.isSuccess && (
          <div className="plants-wall" ref={plantsWallRef}>
            {plantsImagesData.map((lines, i) => (
              <div key={i} className="line">
                {lines.map(plant => {
                  let image = plant.images[0];
                  return (
                    <div key={image.id} className="image-container">
                      <img
                        style={{opacity: imagesLoadedCount === 30 ? "1" : "0"}}
                        src={getAnotherFormat(image.url, "CRS")}
                        alt={`Image de ${image.author}`}
                        onLoad={() => setImagesLoadedCount(prev => prev + 1)}
                      />
                      <small>Par {image.author}</small>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        )}

        {/* Title */}
        <div className="content">
          <h1>Plantaludum</h1>
          <p>Un jeux pour découvrir et apprendre à reconnaitre les plantes !</p>
        </div>

      </header>
    </>
  )
}

export default Home;