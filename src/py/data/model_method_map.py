"""Model method mapping data."""

model_method_map = {
    "pb": {
        "qm": {
            "abin": {
                "gw": [
                    {"path": "/qm/wf/none/pw/none"},
                    {"regex": r"\/qm\/wf\/none\/psp\/.*"},
                    {"regex": r"\/qm\/wf\/none\/smearing\/.*"},
                    {"regex": r"\/qm\/wf\/none\/tetrahedron\/.*"},
                    {"path": "/opt/diff/ordern/cg/none"},
                    {"path": "/linalg/diag/none/davidson/none"},
                ]
            },
            "dft": {
                "ksdft": {
                    "lda": [
                        {"path": "/qm/wf/none/pw/none"},
                        {"regex": r"\/qm\/wf\/none\/psp\/.*"},
                        {"regex": r"\/qm\/wf\/none\/smearing\/.*"},
                        {"regex": r"\/qm\/wf\/none\/tetrahedron\/.*"},
                        {"path": "/opt/diff/ordern/cg/none"},
                        {"path": "/linalg/diag/none/davidson/none"},
                    ],
                    "gga": [
                        {"path": "/qm/wf/none/pw/none"},
                        {"regex": r"\/qm\/wf\/none\/psp\/.*"},
                        {"regex": r"\/qm\/wf\/none\/smearing\/.*"},
                        {"regex": r"\/qm\/wf\/none\/tetrahedron\/.*"},
                        {"path": "/opt/diff/ordern/cg/none"},
                        {"path": "/linalg/diag/none/davidson/none"},
                    ],
                    "hybrid": [
                        {"path": "/qm/wf/none/pw/none"},
                        {"regex": r"\/qm\/wf\/none\/psp\/.*"},
                        {"regex": r"\/qm\/wf\/none\/smearing\/.*"},
                        {"regex": r"\/qm\/wf\/none\/tetrahedron\/.*"},
                        {"path": "/opt/diff/ordern/cg/none"},
                        {"path": "/linalg/diag/none/davidson/none"},
                        {"regex": r"\/qm\/wf\/none\/ao\/pople.*"},
                    ],
                },
            },
        },
    },
    "st": {
        "det": {
            "ml": {
                "re": [
                    {"path": "/none/none/none/linear/least_squares"},
                    {"path": "/none/none/none/linear/ridge"},
                    {"path": "/none/none/none/kernel_ridge/least_squares"},
                ]
            }
        }
    },
}

