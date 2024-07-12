# LingSheng Xu

# src

# ./2DElements
    用于在场景内生成一些html按钮

# ./Particles
    粒子效果

# ./SceneGraphs
    各种场景，第一版的加载逻辑，重构的时候别tm用这个逻辑了，直接建立新场景替换，加载的时候同步减载。

# ./Shaders
    着色器

# ./Utils
    工具类


分层建筑命名规范
    CEIBS_Level_{楼层名字}
    Frame_{楼层名字}_{房间名字} (房间名字将被用以染色)
    记住要重设原点
    楼层内标注要善用原点

重构
    命名规范: 
        类：仿照ue5命名规范，除了工具类，开头都要加 [大类简写]_ 比如 AS_RoomDisplay
        函数：驼峰，首字母小写
    文件结构：
        src:
            着色器
            引擎管理
            定制化-（可去掉）
        static:
            引擎需要
            定制化-（可去掉）
    逻辑：
        modelLoader：大改，针对多场景，多后缀