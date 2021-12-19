import React, { useState, useRef, useEffect } from "react";
import { FaceMesh } from "@mediapipe/face_mesh";
import { Hands } from "@mediapipe/hands";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { Holistic } from "@mediapipe/holistic";
import * as Facemesh from "@mediapipe/face_mesh";
import * as MediaHands from "@mediapipe/hands";
import * as MediaHolistic from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import * as drawingUtils from "@mediapipe/drawing_utils";
import Webcam from "react-webcam";

function MediaPipeCompo() {
    const [indexMediaPipe, setIndexMediaPipe] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const connect = window.drawConnectors;
    var camera = null;

    function onResultsFaceMesh(results) {
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image,
            0,
            0,
            canvasElement.width,
            canvasElement.height
        );
        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_TESSELATION, {
                    color: "#C0C0C070",
                    lineWidth: 1,
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYE, {
                    color: "#FF3030",
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_RIGHT_EYEBROW, {
                    color: "#FF3030",
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYE, {
                    color: "#30FF30",
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_LEFT_EYEBROW, {
                    color: "#30FF30",
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_FACE_OVAL, {
                    color: "#E0E0E0",
                });
                connect(canvasCtx, landmarks, Facemesh.FACEMESH_LIPS, {
                    color: "#E0E0E0",
                });
            }
        }
        canvasCtx.restore();
    }

    function onResultsHands(results) {
        // Draw the overlays.
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                drawingUtils.drawConnectors(canvasCtx, landmarks, MediaHands.HAND_CONNECTIONS,
                    { color: '#00FF00', lineWidth: 5 });
                drawingUtils.drawLandmarks(canvasCtx, landmarks, { color: '#FF0000', lineWidth: 2 });
            }
        }
        canvasCtx.restore();
    }

    function onResultsSelfieSegmentation(results) {
        // Draw the overlays.
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.segmentationMask, 0, 0,
            canvasElement.width, canvasElement.height);

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = 'source-in';
        canvasCtx.fillStyle = '#00FF00';
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);

        canvasCtx.restore();
    }

    function onResultsHolistic(results) {
        // Draw the overlays.
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set canvas width
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.segmentationMask, 0, 0,
            canvasElement.width, canvasElement.height);

        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = 'source-in';
        canvasCtx.fillStyle = '#00FF00';
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);

        canvasCtx.globalCompositeOperation = 'source-over';
        drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, MediaHolistic.POSE_CONNECTIONS,
            { color: '#00FF00', lineWidth: 4 });
        drawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks,
            { color: '#FF0000', lineWidth: 2 });
        drawingUtils.drawConnectors(canvasCtx, results.faceLandmarks, MediaHolistic.FACEMESH_TESSELATION,
            { color: '#C0C0C070', lineWidth: 1 });
        drawingUtils.drawConnectors(canvasCtx, results.leftHandLandmarks, MediaHolistic.HAND_CONNECTIONS,
            { color: '#CC0000', lineWidth: 5 });
        drawingUtils.drawLandmarks(canvasCtx, results.leftHandLandmarks,
            { color: '#00FF00', lineWidth: 2 });
        drawingUtils.drawConnectors(canvasCtx, results.rightHandLandmarks, MediaHolistic.HAND_CONNECTIONS,
            { color: '#00CC00', lineWidth: 5 });
        drawingUtils.drawLandmarks(canvasCtx, results.rightHandLandmarks,
            { color: '#FF0000', lineWidth: 2 });
        canvasCtx.restore();
    }



    useEffect(() => {

        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            },
        });
        const hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            },
        });
        const selfieSegmentation = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            }
        });
        const holistic = new Holistic({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
            }
        });

        faceMesh.setOptions({
            maxNumFaces: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
        });

        hands.setOptions({
            maxNumHands: 2,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        selfieSegmentation.setOptions({
            modelSelection: 1,
        });

        holistic.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            refineFaceLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        faceMesh.onResults(onResultsFaceMesh);
        hands.onResults(onResultsHands);
        selfieSegmentation.onResults(onResultsSelfieSegmentation);
        holistic.onResults(onResultsHolistic);

        setIsLoading(true)

        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null
        ) {
            if (indexMediaPipe === 1) {
                camera = new cam.Camera(webcamRef.current.video, {
                    onFrame: async () => {
                        await faceMesh.send({ image: webcamRef.current.video })
                            .then(() => setIsLoading(false))
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();

            } else if (indexMediaPipe === 2) {
                camera = new cam.Camera(webcamRef.current.video, {
                    onFrame: async () => {
                        // await faceDetection.send({ image: webcamRef.current.video })
                        await holistic.send({ image: webcamRef.current.video })
                            .then(() => setIsLoading(false))
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
            } else if (indexMediaPipe === 3) {
                camera = new cam.Camera(webcamRef.current.video, {
                    onFrame: async () => {
                        await hands.send({ image: webcamRef.current.video })
                            .then(() => setIsLoading(false))
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
            } else if (indexMediaPipe === 4) {
                camera = new cam.Camera(webcamRef.current.video, {
                    onFrame: async () => {
                        await selfieSegmentation.send({ image: webcamRef.current.video })
                            .then(() => setIsLoading(false))
                    },
                    width: 640,
                    height: 480,
                });
                camera.start();
            }
        }
    }, [indexMediaPipe]);

    return (
        <center>
            <h1>Media Pipe</h1>
            <div className="App">
                <div>
                    <button style={indexMediaPipe === 1 ? { backgroundColor: "orange" } : null} onClick={() => setIndexMediaPipe(1)}>Face Mesh</button>
                    <button style={indexMediaPipe === 2 ? { backgroundColor: "orange" } : null} onClick={() => setIndexMediaPipe(2)}>Holistic</button>
                    <button style={indexMediaPipe === 3 ? { backgroundColor: "orange" } : null} onClick={() => setIndexMediaPipe(3)}>Hands</button>
                    <button style={indexMediaPipe === 4 ? { backgroundColor: "orange" } : null} onClick={() => setIndexMediaPipe(4)}>Selfie</button>
                </div>
                {isLoading ? <div>Chargement</div> : null}
                <Webcam
                    ref={webcamRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />{" "}
                <canvas
                    ref={canvasRef}
                    className="output_canvas"
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                ></canvas>
            </div>
        </center>
    );
}
export default MediaPipeCompo;
