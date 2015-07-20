var SHADERS = {
	"vsbonetexture":"\n#define PI texture2D\nuniform sampler2D u_boneMap;uniform float u_matrix_size,u_vector_size;mat4 A(float a){float b=a*u_matrix_size;return mat4(PI(u_boneMap,vec2(b,0)),PI(u_boneMap,vec2(b+u_vector_size,0)),PI(u_boneMap,vec2(b+u_vector_size*2.,0)),PI(u_boneMap,vec2(b+u_vector_size*3.,0)));}",
	"decodefloat":"vec3 B(float a){vec3 b;b[2]=floor(a/65536.);b[1]=floor((a-b[2]*65536.)/256.);b[0]=floor(a-b[2]*65536.-b[1]*256.);return b;}",
	"vsworld":"uniform mat4 u_mvp;uniform vec2 u_uv_offset;attribute vec3 a_position;attribute vec2 a_uv;varying vec2 N;void main(){N=a_uv+u_uv_offset;gl_Position=u_mvp*vec4(a_position,1);}",
	"vswhite":"uniform mat4 u_mvp;attribute vec3 a_position;void main(){gl_Position=u_mvp*vec4(a_position,1);}",
	"psworld":"uniform sampler2D u_texture;uniform float u_a;varying vec2 N;void main(){gl_FragColor=vec4(texture2D(u_texture,N).rgb,u_a);}",
	"pswhite":"void main(){gl_FragColor=vec4(1);}",
	"pscolor":"uniform vec3 u_color;void main(){gl_FragColor=vec4(u_color/255.,1);}",
	"vstexture":"uniform mat4 u_mvp;attribute vec3 a_position;attribute vec2 a_uv;varying vec2 N;void main(){N=a_uv;gl_Position=u_mvp*vec4(a_position,1);}",
	"pstexture":"uniform sampler2D u_texture;varying vec2 N;void main(){gl_FragColor=texture2D(u_texture,N);}",
	"wvsmain":"\n#define T attribute\n#define CJ vec3\n#define CK vec4\nuniform mat4 u_mvp;uniform CJ u_uv_offset;T CJ a_position,a_normal;T vec2 a_uv;T CK a_bones;T float a_bone_number;varying CJ O;varying vec2 N;void C(CJ d,CJ c,float a,CK b,out CJ f,out CJ e){CK l=CK(d,1);CK k=CK(c,0);CK m;mat4 g=A(b[0]);mat4 h=A(b[1]);mat4 i=A(b[2]);mat4 j=A(b[3]);m=CK(0);m+=g*l;m+=h*l;m+=i*l;m+=j*l;m/=a;f=CJ(m);m=CK(0);m+=g*k;m+=h*k;m+=i*k;m+=j*k;e=normalize(CJ(m));}void main(){CJ b,a;C(a_position,a_normal,a_bone_number,a_bones,b,a);O=a;N=a_uv+u_uv_offset.xy;gl_Position=u_mvp*CK(b,1);}",
	"wvscolor":"\n#define T attribute\nuniform mat4 u_mvp;T vec3 a_position;T vec4 a_bones;T float a_bone_number;void main(){vec4 b=vec4(a_position,1);vec4 a=(A(a_bones[0])*b+A(a_bones[1])*b+A(a_bones[2])*b+A(a_bones[3])*b)/a_bone_number;gl_Position=u_mvp*a;}",
	"wvswhite":"\n#define T attribute\nuniform mat4 u_mvp;T vec3 a_position;T vec4 a_bones;T float a_bone_number;void C(vec3 c,float a,vec4 b,out vec3 d){vec4 i=vec4(c,1);vec4 j;mat4 e=A(b[0]);mat4 f=A(b[1]);mat4 g=A(b[2]);mat4 h=A(b[3]);j=vec4(0);j+=e*i;j+=f*i;j+=g*i;j+=h*i;j/=a;d=vec3(j);}void main(){vec3 a;C(a_position,a_bone_number,a_bones,a);gl_Position=u_mvp*vec4(a,1);}",
	"wpsmain":"uniform sampler2D u_texture;uniform bool u_alphaTest;uniform vec4 u_modifier,u_tint;varying vec3 O;varying vec2 N;void main(){\n#ifdef STANDARD_PASS\nvec4 a=texture2D(u_texture,N).bgra;if(u_alphaTest&&a.a<.75){discard;}gl_FragColor=a*u_modifier*u_tint;\n#endif\n#ifdef UVS_PASS\ngl_FragColor=vec4(N,.0,1.);\n#endif\n#ifdef NORMALS_PASS\ngl_FragColor=vec4(O,1.);\n#endif\n#ifdef WHITE_PASS\ngl_FragColor=vec4(1.);\n#endif\n}",
};
