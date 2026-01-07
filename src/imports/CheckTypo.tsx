import svgPaths from "./svg-lboohywl3h";
import img202501061510261 from "figma:asset/9f2a9793f173accc9a4084380721a5a97e9ed46c.png";
import imgToolboxPanel from "figma:asset/949e52bd9b6ec6d4186faa14ac16a6b3486062d0.png";
import img202501061510262 from "figma:asset/452e769eb73a33b52350f990e657267ab2468e50.png";
import img202501061510263 from "figma:asset/394a142e14d3475e17ee0ff9174356f2bdd025ff.png";
import img202501061510264 from "figma:asset/5e153f022ddecff9dd9d2474dc51661636371b0b.png";

function Frame10() {
  return (
    <div className="bg-[#d0d0d0] h-[987px] relative rounded-[8px] shrink-0 w-full">
      <div className="content-stretch flex items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="h-[1334px] relative rounded-[8px] shrink-0 w-[947px]" data-name="截屏2025-01-06 15.10.26 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[8px]">
            <img alt="" className="absolute h-[75.35%] left-0 max-w-none top-[-1.95%] w-full" src={img202501061510261} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dedede] border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col gap-[16px] h-[2938px] items-start left-[222px] pb-[36px] pt-[28px] px-[28px] top-[72px] w-[1218px]">
      <Frame10 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[12px] items-end relative shrink-0">
      <div className="h-[20px] relative shrink-0 w-[89.841px]" data-name="QIMA">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 89.8408 20">
          <path d={svgPaths.p3ea93380} fill="var(--fill-0, #E4002B)" id="QIMA" />
        </svg>
      </div>
      <p className="font-['Gotham_Rounded:Medium',sans-serif] h-[17px] leading-[20px] not-italic relative shrink-0 text-[#1e46bd] text-[20px] tracking-[2px] w-[60px]">labs</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[16px] items-center pl-[4px] pr-0 py-0 relative shrink-0">
      <Frame9 />
    </div>
  );
}

function Avatar() {
  return (
    <div className="[grid-area:1_/_1] bg-[#ff6159] content-stretch flex gap-[10px] items-center justify-center ml-0 mt-0 px-0 py-[7px] relative rounded-[48px] size-[24px]" data-name="Avatar">
      <p className="basis-0 font-['Inter:Semi_Bold',sans-serif] font-semibold grow leading-[12px] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-center text-white uppercase">D</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex flex-col items-start ml-[32px] mt-[2px] relative">
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#191919] text-[14px] text-nowrap">
        <p className="leading-[20px]">Dongguan</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <Avatar />
      <Frame />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Group />
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="chevron-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="icon">
          <g id="shape">
            <path clipRule="evenodd" d={svgPaths.p10c70b80} fill="var(--fill-0, #191919)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[8px] items-center opacity-0 relative shrink-0">
      <Frame3 />
      <ChevronDown />
      <div className="bg-[#dedede] h-[36px] shrink-0 w-px" data-name="Divider" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[8px] size-[20px] top-[8px]" data-name="ICON">
      <div className="absolute inset-[-0.5%_0_0_-0.51%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.1015 20.1">
          <g id="ICON">
            <g id="shape">
              <path d={svgPaths.p290f9700} fill="var(--fill-0, #191919)" />
              <path d={svgPaths.p21ca7480} fill="var(--fill-0, #191919)" />
              <path d={svgPaths.pad7cec0} fill="var(--fill-0, #191919)" />
              <path d={svgPaths.p9f31500} fill="var(--fill-0, #191919)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[rgba(255,255,255,0)] relative rounded-[8px] shrink-0 size-[36px]" data-name="Button - Icon">
      <Icon />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <ButtonIcon />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[8px] size-[20px] top-[8px]" data-name="ICON">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="ICON">
          <g id="shape">
            <path clipRule="evenodd" d={svgPaths.p211c6a00} fill="var(--fill-0, #191919)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="bg-[rgba(255,255,255,0)] relative rounded-[8px] shrink-0 size-[36px]" data-name="Button - Icon">
      <Icon1 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <ButtonIcon1 />
    </div>
  );
}

function User() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="user">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="user">
          <g id="shape">
            <path clipRule="evenodd" d={svgPaths.pa4378f0} fill="var(--fill-0, white)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p2ea08380} fill="var(--fill-0, white)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Avatar1() {
  return (
    <div className="bg-[#ff8261] content-stretch flex gap-[10px] items-center justify-center px-0 py-[12px] relative rounded-[48px] shrink-0 size-[36px]" data-name="Avatar">
      <User />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative rounded-[24px] shrink-0">
      <Avatar1 />
    </div>
  );
}

function Utilities() {
  return (
    <div className="content-stretch flex gap-[16px] items-center opacity-0 relative shrink-0" data-name="utilities">
      <Frame7 />
      <Frame4 />
      <Frame8 />
      <div className="bg-[#dedede] h-[36px] shrink-0 w-px" data-name="Divider" />
      <Frame1 />
    </div>
  );
}

function AcaHeaderUpdated() {
  return (
    <div className="absolute bg-white content-stretch flex h-[72px] items-center justify-between left-0 px-[24px] py-[12px] right-0 top-0" data-name="ACA/ Header updated">
      <Frame2 />
      <Utilities />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1px_0px_0px_#d6d6d6]" />
    </div>
  );
}

function IconLeft() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon-left">
          <g id="shape">
            <path d={svgPaths.p1bd19700} fill="var(--fill-0, #4169E1)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function ButtonSecondary() {
  return (
    <div className="bg-[#e6ecfb] content-stretch flex gap-[8px] h-[36px] items-center px-[12px] py-[8px] relative rounded-[8px] shrink-0" data-name="Button (secondary)">
      <IconLeft />
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4169e1] text-[14px] text-nowrap">
        <p className="leading-[20px]">Add</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-start justify-end opacity-0 relative shrink-0">
      <ButtonSecondary />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[24px] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#191919] text-[18px] text-nowrap tracking-[-0.36px]">AI Suggestion</p>
      <Frame6 />
    </div>
  );
}

function ToolboxPanel() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[1038px] items-start left-[1440px] pb-[80px] pt-[28px] px-[28px] top-[72px] w-[480px]" data-name="Toolbox panel">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute bg-[#f7f7f7] inset-0" />
        <div className="absolute bg-repeat bg-size-[337.00000500679016px_560.5025990009308px] bg-top-left inset-0 opacity-40" style={{ backgroundImage: `url('${imgToolboxPanel}')` }} />
      </div>
      <div aria-hidden="true" className="absolute border-[#dedede] border-[0px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Frame15 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="h-[220px] relative rounded-[8px] shrink-0 w-[164px]">
      <div className="content-stretch flex items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="basis-0 grow h-[865px] min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="截屏2025-01-06 15.10.26 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[8px]">
            <img alt="" className="absolute h-[28.93%] left-0 max-w-none top-[-0.03%] w-[100.18%]" src={img202501061510262} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-2 border-[#4169e1] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame12() {
  return (
    <div className="h-[220px] relative rounded-[8px] shrink-0 w-[164px]">
      <div className="content-stretch flex items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="basis-0 grow h-[865px] min-h-px min-w-px relative shrink-0" data-name="截屏2025-01-06 15.10.26 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[26.56%] left-[-0.61%] max-w-none top-0 w-[98.78%]" src={img202501061510263} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dedede] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame13() {
  return (
    <div className="h-[220px] relative rounded-[8px] shrink-0 w-[164px]">
      <div className="content-stretch flex items-start justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="basis-0 grow h-[865px] min-h-px min-w-px relative shrink-0" data-name="截屏2025-01-06 15.10.26 1">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[26.24%] left-[-0.09%] max-w-none top-0 w-[98.87%]" src={img202501061510264} />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#dedede] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] items-start justify-center left-[24px] p-[8px] top-[100px]">
      <Frame11 />
      <Frame12 />
      {[...Array(2).keys()].map((_, i) => (
        <Frame13 key={i} />
      ))}
    </div>
  );
}

export default function CheckTypo() {
  return (
    <div className="bg-white relative size-full" data-name="Check typo">
      <Frame5 />
      <AcaHeaderUpdated />
      <ToolboxPanel />
      <Frame14 />
      <div className="absolute bg-[#dedede] h-[392px] left-[210px] rounded-[18px] top-[108px] w-[12px]" />
    </div>
  );
}