window.addEventListener("load",event =>main());
//window.addEventListener("resize",event =>reasize());

const main = () => {
    const viewer = new PANOLENS.Viewer();
    
    const panorama1 = new PANOLENS.ImagePanorama('../image/panorama1.jpeg');
    const panorama2 = new PANOLENS.ImagePanorama('../image/panorama2.jpeg');
    
    panorama1.link(panorama2, new THREE.Vector3(200, 2000, 5000));
    panorama2.link(panorama1, new THREE.Vector3(-1000, -10, -2000));
    
    const image1 = new PANOLENS.Infospot(3, PANOLENS.DataImage.Info);
    image1.position.set(27, 25, -30);
    image1.addHoverElement(document.getElementById('pamukkale'));
    panorama1.add(image1);
    
    const image2 = new PANOLENS.Infospot(3, PANOLENS.DataImage.Info);
    image2.position.set(-54, 25, -30);
    image2.addHoverElement(document.getElementById('cappadoce'));
    panorama2.add(image2);
    
    const audio1 = new PANOLENS.Infospot(20, PANOLENS.DataImage.Info);
    audio1.position.set(-400, 75, 100);
    audio1.addHoverElement(document.getElementById('campfire'));
    panorama1.add(audio1);
    
    const audio2 = new PANOLENS.Infospot(20, PANOLENS.DataImage.Info);
    audio2.position.set(200, 75, 100);
    audio2.addHoverElement(document.getElementById('heavy_rain'));
    panorama2.add(audio2);
    
    const video1 = new PANOLENS.Infospot(3, PANOLENS.DataImage.Info);
    video1.position.set(-27, 15, -50);
    video1.addHoverElement(document.getElementById('man_2020'));
    panorama1.add(video1);
    
    const video2 = new PANOLENS.Infospot(3, PANOLENS.DataImage.Info);
    video2.position.set(54, 12, -50);
    video2.addHoverElement(document.getElementById('slap_2'));
    panorama2.add(video2);
    
    viewer.add(panorama1, panorama2);
}