import Image from "next/image";

const steps = [
    {
        image: "/howto/copylink.jpeg",
        title: "Copy the Link",
        description: "Open Instagram, find the video or reel, tap Share and select \"Copy Link\".",
    },
    {
        image: "/howto/pastelink.jpeg",
        title: "Paste the Link",
        description: "Paste the copied Instagram link into the input field above.",
    },
    {
        image: "/howto/downloadvideo.jpeg",
        title: "Download the Video",
        description: "Click Download and save your Instagram video to your device.",
    },
];

export default function HowTo() {
    return (
        <div className="max-w-7xl mx-auto px-4 lg:px-0 py-12 lg:py-24">
            <div className="text-center bg-white mt-12">
                <h1 className="text-3xl font-bold text-gray-800">Download Instagram Videos in 3 Easy Steps</h1>
                <p className="text-gray-600">Get your favorite content saved to your device in seconds.</p>
            </div>
            <div className="grid lg:grid-cols-3 mt-12  gap-8 lg:px-0 items-center justify-center text-center">
                {steps.map((step, index) => (
                    <div key={step.image}>
                        <div className="items-center justify-center flex">
                            <Image
                                src={step.image}
                                alt={step.title}
                                width={500}
                                height={300}
                                className="rounded-2xl lg:max-w-sm object-cover  bg-linear-to-r from-red-300 to-violet-300 p-2 border border-gray-100 shadow-2xl"
                            />
                        </div>
                        <div className="flex items-center bg-white justify-center gap-2 mt-12 text-center">
                            <h2 className="font-bold text-gray-800 bg-linear-to-r from-red-500 to-violet-400 py-2 px-4 rounded-full">{index + 1}</h2>
                            <h3 className="text-gray-600 text-2xl font-bold">{step.title}</h3>
                        </div>eeweeeeee
                        <div className="mt-2 text-center bg-white justify-center flex">
                            <p className="text-gray-700 max-w-72">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}